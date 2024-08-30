# dateTime
Transforms ISO date and time string to `Date` and serializes back to ISO string.

```ts
import { Model, column } from '@outloud/model'

class User extends Model {
  @column.dateTime()
  declare createdAt: Date
}

const user = User.create({
  createdAt: '2023-11-17T15:24:06.764Z'
})

user.createdAt // Date
user.toJSON().createdAt // '2023-11-17T15:24:06.764Z'
```

## Custom serialization

It's possible to define custom serialization logic for dates.

### Configure serializer

Globally configure serializer once in the app.

```ts
import dayjs, { type Dayjs } from 'dayjs'
import { configure } from '@outloud/model'

configure({
  date: {
    deserialize: (value: Date) => dayjs(value),
    serialize: (value: Dayjs) => value.toDate()
  }
})
```

### Use new type

```ts
import type { Dayjs } from 'dayjs'
import { Model, column } from '@outloud/model'

class User extends Model {
  @column.dateTime()
  declare createdAt: Dayjs
}

const user = User.create({
  createdAt: '2023-11-17T15:24:06.764Z'
})

user.createdAt // Dayjs
user.toJSON().createdAt // '2023-11-17T15:24:06.764Z'
```
