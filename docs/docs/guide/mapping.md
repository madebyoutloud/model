# Mapping

Model class provides several method for seamless mapping of raw JSON data.

## Create from unknown JSON data

To create model from unknown JSON data use `fromJSON` method. This will always create single instance of model.

::: tip
If the provided data is already instance of Model, it will return the instance itself, without re-creating new one.
:::


```ts
import { Model } from '@outloud/model'

class User {
  id: string
}

const data: any = {} // data from API
const user = User.fromJSON(data)

User.fromJSON(user) === user // true
```

## Array and optional mapping

`map` method allows you to dynamically create array of Models or nullable instances.


```ts
import { Model } from '@outloud/model'

class User {
  id: string
}

User.map({} as Record<string, unknown>) // User
User.map({} as Record<string, unknown> | null) // User or null
User.map([]) // User[]
```

Sometimes you might not know what format the response might have, in this case you can force map the input.
If you force map to single instance, but the provided data is array, first element is used.

```ts

// force map to array
User.map({} as any, true) // User[] with 1 element
User.map(null as any, true) // User[] with 0 elements
User.map([{}] as any, true) // User[] with 1 element

// force map to single instance
User.map({} as any, false) // User | null
User.map(null as any, false) // User | null
User.map([] as any, false) // User | null
```

## Creating mappers

If you need to create mapper that will create Models as needed, you can use `mapper` method.


```ts
import { Model } from '@outloud/model'

class User {
  id: string
}

const arrayMapper = User.mapper('array')
arrayMapper([{}, {}]) // User[]

const modelMapper = User.mapper('model')
modelMapper({}) // User

const optionalMapper = User.mapper('nullable')
optionalMapper({}) // User | null


// for example in Nuxt
useAsyncData(() => fetch('/v1/posts'), {
  transform: User.mapper('array')
})
```
