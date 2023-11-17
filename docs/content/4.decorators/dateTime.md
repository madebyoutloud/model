[Decorators]{.text-primary.font-semibold}

# dateTime
Transforms ISO date and time string to dayjs and serializes back to ISO string.

```ts
import type { Dayjs } from 'dayjs'
import { Model, column } from '@outloud/model'

class User extends Model {
  @column.dateTime() createdAt: DayJs
}

const user = User.create({
  createdAt: '2023-11-17T15:24:06.764Z'
})
```
