---
name: use-outloud-model
description: Read BEFORE using @outloud/model or creating API entity models. Covers fields, relationships, dates, mapping API data, typing from generated API types, serialization and Nuxt setup.
---

# @outloud/model

## Recommended defaults

- Use a model for API entities that need dates, relationships, getters or methods. Keep plain shapes, such as a nested address, as interfaces.
- One model class per file, in the feature's `models/` folder.
- Declare data properties with `declare`, without initializers, so they don't overwrite mapped values. A property needs a decorator only to convert its value: `@column.dateTime()`, `@column.date()`, or a relationship.
- Map API data with `fromJSON(data)` and `fromArray(list)`, never by casting a plain object to the model. Mapping creates the instance, converts dates and creates related models. `fromJSON` returns `null` for `null` or `undefined` data, typed as such only when the data may be null; `fromArray` returns `[]`.
- Use `mapperJSON()` and `mapperArray()` where a function is expected, such as `useAsyncData`'s `transform` or a list's `model` option.
- Relationships: `@relation(() => Role)` for one model, `@relation(() => Comment, { many: true })` for an array. Declare the type nullable or optional as the API returns it.
- When the API has generated types (openapi-typescript), type the model from them with `Model.typed<Data>()` instead of declaring each property again. Leave out with `Omit` the properties the model declares with another type, such as dates and relationships.
- Update an existing instance with `merge(values)`, e.g. with the response after saving. Use `clone()` for a copy to edit, e.g. in a form, and `toJSON()` for plain data.

```ts
import { Model, column, relation } from '@outloud/model'
import { Role } from '#layers/auth/models/role'

export class User extends Model {
  static endpoint = '/v1/users'

  declare id: string
  declare email: string

  @column.dateTime()
  declare createdAt: Date

  @relation(() => Role)
  declare role: Role | null

  get label() {
    return this.email
  }
}
```

```ts
const user = User.fromJSON(await api.$get(`${User.endpoint}/${id}`))
const users = User.fromArray(await api.$get(User.endpoint))

const { data } = await useAsyncData('users', () => api.$get(User.endpoint), {
  transform: User.mapperArray(),
})
```

## Valid alternatives

- `User.create(values)` when the values are already typed, e.g. built in code. API data goes through `fromJSON`.
- `Model.column` and `Model.relation`, the same decorators, in files that import only `Model`.
- A custom column: a function returning `column({ deserialize, serialize, meta })`. Read columns back by `meta` from `Model.$columns`.
- Mixins for shared columns or methods, typed with `NormalizedModel`: `function Timestamps<T extends NormalizedModel>(Base: T) { return class extends Base { ... } }`, used as `class Post extends Timestamps(Model) {}`.
- A base class with `typed`: redeclare it once, `declare static typed: TypedMethod<typeof RestModel>`, so subclasses write `RestModel.typed<Data>()`. Without it, pass the class: `RestModel.typed<Data, typeof RestModel>()`.
- Day.js instead of `Date`: `configure({ date: { deserialize: (value) => dayjs(value), serialize: (value) => value.toDate() } })` once at app start, and declare the properties as `Dayjs`.
- Overriding `toJSON()` for custom serialization, calling `super.toJSON()`.

## Avoid by default

- A getter with the same name as an API field. The field's data is skipped, so the getter wins; rename one of them if the data is needed.
- Initializers on data properties (`name = ''`, `items = []`). They are fine for a custom collection a relationship fills, `items = new Collection<Item>()`.
- Spreading a model (`{ ...user }`) to get plain data. Use `toJSON()`, which serializes dates and relationships.
- Deep-copying a model with `JSON.parse(JSON.stringify(model))`. Use `clone()`.
- Importing models in Nuxt `server/` code, where Nitro compiles decorators as standard ones and they break.

## Invalid patterns

- `User.map(...)`, `User.mapper(...)`, `compose(...)`, `user.fill(...)`, `user.serialize()`: removed in 2.0. Use `fromJSON`/`fromArray`, `mapperJSON`/`mapperArray`, mixins, `merge` and `toJSON`.
- `@hasOne` and `@hasMany` in new code: deprecated aliases of `@relation`.
- `fromJSON` on an array or `fromArray` on a single object. Neither converts between them.
- `const user = data as User`, or `Object.assign(new User(), data)`.
- Nuxt's `experimental.decorators` or Babel decorator plugins. Enable TypeScript's `experimentalDecorators` instead.
- `require('@outloud/model')`. The package is ES modules only.

## Recipes

### Typing from a generated API type

```ts
import { Model, column, relation } from '@outloud/model'
import type { components } from '~/types/api'

type ProviderData = components['schemas']['Provider']

export class Provider extends Model.typed<Omit<ProviderData, 'createdAt' | 'owner'>>() {
  @column.dateTime()
  declare createdAt: Date

  @relation(() => User)
  declare owner: User | null

  get label() {
    return this.name
  }
}
```

### Nuxt setup

Models returned by `useAsyncData`, `useState` or a Pinia store reach the browser as plain objects unless a payload plugin revives them, with a key per model:

```ts
export default definePayloadPlugin(() => {
  definePayloadReducer('User', (value) => value?.constructor === User && value.toJSON())
  definePayloadReviver('User', (data) => User.fromJSON(data))
})
```

Keep Vue from unwrapping refs inside models, once in the project's shared types file:

```ts
import type { Model } from '@outloud/model'

declare module '@vue/reactivity' {
  export interface RefUnwrapBailTypes {
    model: Model
  }
}
```
