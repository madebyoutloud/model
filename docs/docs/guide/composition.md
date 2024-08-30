# Composition

Library also provides helpers to compose models with shared functionality.

## Define mixin/trait
```ts
import { type NormalizedModel, column } from '@outloud/model'

export function TimestampsTrait<T extends NormalizedModel>(Base: T) {
  class Timestamps extends Base {
    @column.dateTime()
    createdAt: Date

    @column.dateTime()
    updatedAt: Date
  }

  return Timestamps
}
```

## Compose model

```ts
import { Model, compose } from '@outloud/model'

class Post extends compose(Model).with(TimestampsTrait) {
  id: string
}

const post = Post.create({
  id: '123',
  createdAt: '2023-11-17T14:40:19.964Z',
  updatedAt: '2023-11-17T14:40:19.964Z',
})

post.createdAt // instanceof Date
```
