import type { ModelValues } from '../types'
import type { ModelClass } from '../Model'

export function toModel<
  T extends ModelClass,
  Value extends ModelValues<InstanceType<T>>[] | ModelValues<InstanceType<T>>,
  Result = InstanceType<T>,
>(value: Value, model: T): Value extends any[] ? Result[] : (Value extends null ? Result | null : Result)

export function toModel<
  T extends ModelClass,
  Value extends ModelValues<InstanceType<T>>[] | ModelValues<InstanceType<T>> | null,
>(
  value: Value,
  model: T,
): InstanceType<T>[] | InstanceType<T> | null {
  if (Array.isArray(value)) {
    if (value.length && !(value[0] instanceof model)) {
      return value.map(item => model.create(item as any))
    }
  }
  else if (value && !(value instanceof model)) {
    return model.create(value as any)
  }

  return value as InstanceType<T> | null
}
