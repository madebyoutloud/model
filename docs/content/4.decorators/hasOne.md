[Decorators]{.text-primary.font-semibold}

# hasOne
Transforms plain object to model.

```ts
import type { Dayjs } from 'dayjs'
import { Model, column } from '@outloud/model'

class Organization extends Model {
  name: string
}

class User extends Model {
  @hasOne() organization: Organization
}

const user = User.create({
  organization: {
    name: 'Outloud'
  }
})
```
