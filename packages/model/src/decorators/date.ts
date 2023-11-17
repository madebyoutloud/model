import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { DateColumnDecorator } from '../types'
import type { Model, ModelClass } from '../Model'

function deserialize(value: any, attributeName: string, modelInstance: Model): Dayjs {
  if (!value) {
    return value
  }

  if (typeof value === 'string' || value instanceof Date) {
    return dayjs(value)
  }

  if (dayjs.isDayjs(value)) {
    return value
  }

  const modelName = modelInstance.constructor.name

  throw new Error(
    `Cannot format "${modelName}.${attributeName}" ${typeof value} value to an instance of "dayjs.Dayjs"`,
  )
}

function serialize(value: Dayjs | string) {
  if (dayjs.isDayjs(value)) {
    return value.format('YYYY-MM-DD')
  }

  return value
}

export const dateColumn: DateColumnDecorator = (options = {}) => {
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
