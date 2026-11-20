# Mapping

Model classes create instances from plain data, such as API responses.

## From object

`fromJSON` creates one instance. It pairs with `toJSON()`, so code that revives classes by `fromJSON()`, such as a Nuxt payload reviver, works with models.

::: tip
An instance of the model is returned as it is, without creating a new one.
:::

```ts
import { Model } from '@outloud/model'

class User extends Model {
  declare id: string
}

const data: any = {} // data from API
const user = User.fromJSON(data)

User.fromJSON(user) === user // true
User.fromJSON(JSON.parse(JSON.stringify(user))) // User
```

## From array

`fromArray` creates an instance from each item.

```ts
User.fromArray([{ id: '1' }, { id: '2' }]) // User[]
```

Handle `null` before mapping when the API can return it:

```ts
const user = data ? User.fromJSON(data) : null
```

## Mappers

`mapperJSON` and `mapperArray` return functions to pass to `transform` options or `.then()`.

```ts
const toUser = User.mapperJSON()
toUser({}) // User

const toUsers = User.mapperArray()
toUsers([{}, {}]) // User[]

// for example in Nuxt
useAsyncData(() => $fetch('/v1/users'), {
  transform: User.mapperArray(),
})
```
