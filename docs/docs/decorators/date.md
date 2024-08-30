# date
Transforms ISO date string to `Date` and serializes back to ISO string.

```ts
import { Model, column } from '@outloud/model'

class User extends Model {
  @column.date()
  declare birthDate: Date
}

const user = User.create({
  birthDate: '1990-01-01'
})

user.birthDate // Date
user.toJSON().birthDate // '1990-01-01'
```

See [Date & Time](date-time) for custom serialization.
