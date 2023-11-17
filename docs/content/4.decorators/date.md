[Decorators]{.text-primary.font-semibold}

# date
Transforms ISO date string to dayjs and serializes back to ISO string.

```ts
import type { Dayjs } from 'dayjs'
import { Model, column } from '@outloud/model'

class User extends Model {
  @column.date() birthDate: DayJs
}

const user = User.create({
  birthDate: '1990-01-01'
})
```
