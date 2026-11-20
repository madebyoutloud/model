---
name: use-outloud-model
description: Read BEFORE using @outloud/model or creating API entity models. Covers properties, dates, relationships, mapping API data and typing from generated API types.
---

# @outloud/model

## Recommended defaults

- Use a model for API entities that need dates, relationships, getters or methods. Keep plain nested shapes as interfaces.
- One model per file, in the feature's `models/` folder.
- Declare data properties with `declare` and no initializer. Decorate only what converts: `@column.dateTime()`, `@column.date()`, `@relation(() => Role)`, `@relation(() => Comment, { many: true })`.
- Map API data with `fromJSON(data)` and `fromArray(list)`, and pass `mapperJSON()` or `mapperArray()` where a function is expected, such as a `transform` option. Both handle `null`.
- With generated API types, extend `Model.typed<Data>()` instead of declaring each property. `Omit` the properties the model declares with another type, such as dates and relationships.
- `merge(values)` to update an instance, `clone()` for a copy to edit, `toJSON()` for plain data.

```ts
import { Model, column, relation } from '@outloud/model'
import type { components } from '~/types/api'
import { Role } from './role'

type UserData = components['schemas']['User']

export class User extends Model.typed<Omit<UserData, 'createdAt' | 'role'>>() {
  static endpoint = '/v1/users'

  @column.dateTime()
  declare createdAt: Date

  @relation(() => Role)
  declare role: Role | null

  get label() {
    return this.email
  }
}

const users = User.fromArray(await api.$get(User.endpoint))
```

## Avoid

- Casting data to a model (`data as User`) or spreading a model for plain data (`{ ...user }`).
- A getter named like an API field: the field's data is skipped.
- Importing models in Nuxt `server/` code, where decorators break.

## Nuxt

Enable `experimentalDecorators` in `typescript.tsConfig.compilerOptions`. Models from `useAsyncData`, `useState` and stores reach the browser as plain objects unless a payload plugin revives them, with a key per model:

```ts
export default definePayloadPlugin(() => {
  definePayloadReducer('User', (value) => value?.constructor === User && value.toJSON())
  definePayloadReviver('User', (data) => User.fromJSON(data))
})
```
