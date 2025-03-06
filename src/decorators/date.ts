import type { ColumnDecorator } from '../types.js'
import type { ModelClass } from '../model.js'
import { config } from '../config.js'
import { deserialize } from './date_time.js'

function serialize(value: unknown) {
  if (typeof value === 'string' || value === null || value === undefined) {
    return value
  }

  if (!(value instanceof Date)) {
    value = config.date.serialize(value)
  }

  if (value instanceof Date) {
    return [
      String(value.getFullYear()).padStart(4, '0'),
      String(value.getMonth() + 1).padStart(2, '0'),
      String(value.getDate()).padStart(2, '0'),
    ].join('-')
  }

  return value
}

export const date: ColumnDecorator = (options = {}) => {
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

    normalizedOptions.meta.type = 'date'

    Model.$addColumn(property, normalizedOptions)
  }
}
