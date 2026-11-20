# Relationships
Models can relate to one other model or to many of them. Related models are created whenever the model is created or its values are filled or merged.

Define a relationship with the `relation` decorator.

## One To One
For example, a User model might be associated with one Role model.

```ts
import { Model, relation } from '@outloud/model'

class Role extends Model {
  declare id: string
  declare name: string
  declare isAdmin: boolean
}

class User extends Model {
  declare id: string
  declare email: string

  @relation(() => Role)
  declare role: Role
}
```

Nullable or optional types are supported as well. `null` and `undefined` in the data become `null`.

```ts
class User extends Model {
  @relation(() => Role)
  declare role?: Role | null
}
```

Creating the model creates its relationships as well.
```ts
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
A blog post may have any number of comments. Pass `{ many: true }` for an array of related models. `null` and `undefined` in the data become an empty array.

```ts
import { Model, relation } from '@outloud/model'

class Comment extends Model {
  declare id: string
  declare text: string
}

class Post extends Model {
  declare id: string
  declare title: string

  @relation(() => Comment, { many: true })
  declare comments: Comment[]
}
```

When the property already holds an array, its items are replaced and the array itself is kept, so a custom collection keeps its class.

```ts
class CustomArray<T> extends Array<T> {
  get first() {
    return this.at(0)
  }
}

class Post extends Model {
  @relation(() => Comment, { many: true })
  comments = new CustomArray<Comment>()
}
```

## Without imports
`Model.relation` and `Model.column` are the same decorators, for model files that import only `Model`.

```ts
import { Model } from '@outloud/model'

class Post extends Model {
  @Model.relation(() => Comment, { many: true })
  declare comments: Comment[]
}
```
