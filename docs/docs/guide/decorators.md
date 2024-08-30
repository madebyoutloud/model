# Decorators

Decorators allow you extend property's functionality.

## Example

```ts
import { Model, column } from '@outloud/model'

class User extends Model {
  @column.dateTime()
  declare createdAt: Date
}

// createdAt will be automatically converted to Date
const user = User.create({
  createdAt: '2023-11-17T15:24:06.764Z'
})

user.createdAt // Date
```

## Extending decorators

`column` object can be extended with your own decorators

```ts
import { column, type ColumnDecorator } from '@outloud/model'

// create from JSON
function deserialize(value: unknown) {
  if (Array.isArray(value)) {
    return { x: value[0], y: value[1] }
  }

  return value
}

// format to JSON
function serialize(value: unknown) {
  if (typeof value === 'object' && !Array.isArray(value)) {
    return [value.x, value.y]
  }

  return value
}

const decorator: ColumnDecorator = (options = {}) => {
  return function decorateAsColumn(target, property) {
    const Model = target.constructor as ModelClass
    Model.$boot()

    const normalizedOptions = Object.assign(
      {
        deserialize,
        serialize,
        meta: {},
      },
      options,
    )

    normalizedOptions.meta.type = 'point'
    Model.$addColumn(property, normalizedOptions)
  }
}

// extend column object
column.extend('point', decorator)

// extend types
declare module '@outloud/model' {
  interface Column {
    point: ColumnDecorator
  }
}
```

### Usage

```ts
import { Model, column } from '@outloud/model'

interface Point {
  x: number
  y: number
}

class User extends Model {
  @column.point()
  declare location: Point | null
}

// createdAt will be automatically converted to Date
const user = User.create({
  location: [1, 0]
})

user.location // { x: 1, y: 0 }
```
