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

## Custom decorators

`column()` takes `deserialize`, `serialize` and `meta`, so a custom decorator is a function that returns it:

```ts
import { column } from '@outloud/model'

interface Point {
  x: number
  y: number
}

export function point() {
  return column({
    // from JSON
    deserialize: (value: unknown) => Array.isArray(value) ? { x: value[0], y: value[1] } : value,
    // to JSON
    serialize: (value: Point | null) => value ? [value.x, value.y] : value,
    meta: { type: 'point' },
  })
}
```

```ts
import { Model } from '@outloud/model'

class User extends Model {
  @point()
  declare location: Point | null
}

const user = User.fromJSON({
  location: [1, 0]
})

user.location // { x: 1, y: 0 }
```

`meta` is kept in `Model.$columns`, to find columns by it later:

```ts
const points = [...User.$columns].filter(([, column]) => column.meta.type === 'point')
```

## Extending `column`

To call it as `@column.point()`, add it to the `column` object and its type:

```ts
import { column, type ColumnDecorator } from '@outloud/model'

column.extend('point', point)

declare module '@outloud/model' {
  interface Column {
    point: ColumnDecorator
  }
}
```
