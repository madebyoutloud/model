# Model
Maps plain data, such as API responses, to typed model classes with dates, relationships and getters.

<p>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript">
  <a href="https://www.npmjs.com/package/@outloud/model"><img src="https://badgen.net/npm/v/@outloud/model/latest" alt="Version"></a>
  <a href="https://npmcharts.com/compare/@outloud/model?minimal=true"><img src="https://badgen.net/npm/dm/@outloud/model" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@outloud/model"><img src="https://img.shields.io/npm/l/@outloud/model.svg?sanitize=true" alt="License"></a>
</p>

## Installation
```bash
npm install @outloud/model
```

Enable `experimentalDecorators` in `tsconfig.json`.

## Usage
```ts
import { Model, column, relation } from '@outloud/model'

class User extends Model {
  declare id: string
  declare firstName: string
  declare lastName: string

  @column.dateTime()
  declare createdAt: Date

  @relation(() => Role)
  declare role: Role | null

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

const user = User.fromJSON(await api.$get('/users/1'))
const users = User.fromArray(await api.$get('/users'))

user.createdAt // Date
user.toJSON() // plain data again
```

With types generated from an OpenAPI schema, a model takes its properties from them:

```ts
class Provider extends Model.typed<ProviderData>() {}
```

## Documentation
To learn more, check [documentation](https://docs.outloud.dev/model/).
