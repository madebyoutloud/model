import type { ModelClass } from '../model.js'
import type { ColumnDecorator, ColumnOptions, DecoratorFn } from '../types.js'
import { date } from './date.js'
import { dateTime } from './date_time.js'

const columnDecorator: ColumnDecorator = (options = {}) => {
  return function decorateAsColumn(target, property) {
    const Model = target.constructor as ModelClass
    Model.$boot()
    Model.$addColumn(property, options || {})
  }
}

export interface Column {
  (options?: Partial<ColumnOptions>): DecoratorFn
  date: ColumnDecorator
  dateTime: ColumnDecorator
  extend(name: string, fn: (...args: any[]) => DecoratorFn): void
}

export const column: Column = Object.assign(columnDecorator, {
  date,
  dateTime,
  extend,
})

function extend(this: Column, name: string, fn: (...args: any[]) => DecoratorFn) {
  Object.defineProperty(this, name, { value: fn })
}
