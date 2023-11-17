[Decorators]{.text-primary.font-semibold}

# hasMany
Transforms array of plain objects to models.

```ts
import type { Dayjs } from 'dayjs'
import { Model, hasMany } from '@outloud/model'

class Post extends Model {
  id: number
}

class User extends Model {
  @hasMany() posts: Post[]
}

const user = User.create({
  posts: [{
    id: 1
  }]
})
```
