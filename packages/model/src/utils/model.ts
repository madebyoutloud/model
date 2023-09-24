import type { ModelValues } from '..'
import type { ModelClass } from '../Model'

export function toModel<
  T extends ModelClass,
  Result extends InstanceType<T>,
  Value extends ModelValues<Result>[] | ModelValues<Result> | null,
>(value: Value, model: T & { new(): Result }): Value extends any[] ? Result[] : (Value extends null ? Result | null : Result)

export function toModel<
  T extends ModelClass,
  Result extends InstanceType<T>,
  Value extends ModelValues<Result>[] | ModelValues<Result> | null,
>(
  value: Value,
  model: T,
): InstanceType<T>[] | InstanceType<T> | null {
  if (Array.isArray(value)) {
    if (value.length && !(value[0] instanceof model)) {
      return value.map(item => model.create(item))
    }
  }
  else if (value && !(value instanceof model)) {
    return model.create(value as any)
  }

  return value as InstanceType<T> | null
}
