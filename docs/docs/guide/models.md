# Models
Learn how to use Model class, which is base of all your data mapping.

## Define model
Create a new class that extends `Model` and define propeties on it.

```ts
import { Model } from '@outloud/model'

class Post extends Model {
  static endpoint = 'v1/posts'

  declare id: string
  declare uid: string
  declare title: string

  get endpoint() {
    return `${Post.endpoint}/${this.id}`
  }

  get link() {
    return `/p/${this.uid}`
  }
}
```

## Create model
To create model from your data simply call `create` method on your class.

```ts
const post = Post.create({
  id: '123',
  uid: 'my-post',
  title: 'My post'
})
```

Data for a property that only has a getter, such as `link` above, is skipped, so an API that adds a field with the same name doesn't break the model.

## Update model
To update existing model, because there is new data available you can call `merge` method on your object or simply change the property.

```ts
post.merge({
  title: 'My post - updated'
})

// or
post.title = 'My post - updated'
```

## Serialize model
`toJSON` returns the model as plain data, with columns serialized. `JSON.stringify` calls it as well.

```ts
const json = post.toJSON()
```

## Clone model
You can clone model to new one, without affecting the existing one, using `clone` method.

```ts
const post2 = post.clone()
```
