# Relationships
Model support relationships to other models using `One To One` or `One To Many`. Relationships will be automatically mapped as well when creating model or updating its values.

The relationships can de defined using a decorator, see examples below.


## One To One
A one-to-one relationship is a very basic type of relationship. For example, a User model might be associated with one Role model.

```ts
import { Model, hasOne } from '@outloud/model'

class Role {
  declare id: string
  declare name: string
  declare isAdmin: boolean
}

class User {
  declare id: string
  declare email: string

  @hasOne(() => Role)
  declare role: Role
}

```

Nullable or optional types are supported as well.

```ts
class User {
  declare id: string
  declare email: string

  @hasOne(() => Role)
  declare role?: Role | null
}
```

When you create model, it will automatically create relationships as well.
```ts
// create model
const user = User.create({
  id: '1',
  email: 'test@test.com',
  role: {
    id: '2'
  }
})

user.role // instanceof Role
```

## One To Many
A one-to-many relationship is used to define relationships where a single model is the parent to one or more child models. For example, a blog post may have an infinite number of comments.

```ts
import { Model, hasMany } from '@outloud/model'

class Comment {
  declare id: string
  declare text: string
  declare userId: string
}

class Post {
  declare id: string
  declare title: string
  declare userId: string

  @hasMany(() => Comment)
  declare comments: Comment[]
}
```

When creating array of models the Array's constructor is preserved.

```ts
class CustomArray extends Array {
  get first() {
    return this.at(0)
  }
}

class Post {
  declare id: string
  declare title: string

  @hasMany(() => Comment)
  declare comments = new CustomArray<Comment>()
}
```
