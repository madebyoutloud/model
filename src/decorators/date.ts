import { config } from '../config.js'
import type { ModelClass } from '../model.js'
import type { ColumnDecorator } from '../types.js'
import { deserialize as deserializeDateTime } from './date_time.js'

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Reads `YYYY-MM-DD` as midnight in local time. `new Date('YYYY-MM-DD')` reads it as UTC midnight, which is the day
 * before west of UTC.
 */
function deserialize(value: unknown): unknown {
  const match = typeof value === 'string' ? datePattern.exec(value) : null

  if (match) {
    value = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  }

  return deserializeDateTime(value)
}

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
