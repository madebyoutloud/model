import type { ModelClass } from '../Model'
import type { ColumnDecorator, DateColumnDecorator, DateTimeColumnDecorator } from '../types'
import { dateColumn } from './date'
import { dateTimeColumn } from './dateTime'

export const column: ColumnDecorator & {
  date: DateColumnDecorator
  dateTime: DateTimeColumnDecorator
} = (options = {}) => {
  return function decorateAsColumn(target, property) {
    const Model = target.constructor as ModelClass
    Model.$boot()
    Model.$addColumn(property, options || {})
  }
}

column.date = dateColumn
column.dateTime = dateTimeColumn
