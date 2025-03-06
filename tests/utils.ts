import { type ModelClass, type NormalizedModel, column } from '../src/index.js'
import type { ColumnOptions, DecoratorFn } from '../src/types.js'

export function Enumerable<T extends NormalizedModel>(Base: T) {
  return class Enumerable extends Base {
    static $getEnumerationNames() {
      return [...this.$columns.values()].filter((item) => item.meta.enumeration)
        .map((item) => item.meta.enumeration)
    }
  }
}

export function enumeration(enumeration: string, options: Partial<ColumnOptions> = {}): DecoratorFn {
  return function decorateAsColumn(target, property) {
    const Model = target.constructor as ModelClass
    Model.$boot()

    options.meta = options.meta ?? {}
    options.meta.enumeration = enumeration

    Model.$addColumn(property, options || {})
  }
}

export function Timestamps<T extends NormalizedModel>(Base: T) {
  class Timestamps extends Base {
    @column.dateTime()
    declare createdAt: Date

    @column.dateTime()
    declare updatedAt: Date
  }

  return Timestamps
}
