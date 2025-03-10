# Getting Started

This library provides set of classes and utilities for mapping plan data to class models.

## Features
- Computed properties
- Composition
- Related models
- Related collections
- Mapping response from API
- Custom property serialization
- Cloning

## Example
```ts
import { Model } from '@outloud/model'

const data = {
  firstName: 'Hello',
  lastName: 'World'
}

class User extends Model {
  firstName: string
  lastName: string

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

const user = User.create(data)

user.fullName // Hello World
```
