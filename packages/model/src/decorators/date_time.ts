import type { ColumnDecorator } from '../types.js'
import type { ModelClass } from '../model.js'
import { config } from '../config.js'

export function deserialize(value: any): unknown {
  if (typeof value === 'string') {
    value = new Date(value)
  }

  if (value instanceof Date) {
    return config.date.parse(value)
  }

  return value
}

function serialize(value: unknown) {
  if (typeof value === 'string' || value === null || value === undefined) {
    return value
  }

  if (!(value instanceof Date)) {
    value = config.date.format(value)
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  return value
}

export const dateTime: ColumnDecorator = (options = {}) => {
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

    normalizedOptions.meta.type = 'dateTime'

    Model.$addColumn(property, normalizedOptions)
  }
}
