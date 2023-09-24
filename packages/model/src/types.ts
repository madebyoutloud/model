import type { Dayjs } from 'dayjs'
import type { Model, ModelClass } from './Model'

export type ModelValues<T> = T extends ModelClass ? {
  [K in keyof T]?: T[K] extends Function ? never : K
} : T extends object ? {
  [K in keyof T]?: ModelValues<T[K]>
} : T

export type DecoratorFn = (target: any, property: any) => void

export type TypedDecorator<PropType> = <
  TKey extends string,
  TTarget extends { [K in TKey]: PropType },
>(
  target: TTarget,
  property: TKey
) => void

export type OptionalTypedDecorator<PropType> = <
  TKey extends string,
  TTarget extends { [K in TKey]?: PropType },
>(
  target: TTarget,
  property: TKey
) => void

export type ColumnOptions = {
  meta: Record<string, any>
  deserialize?: (value: any, attribute: string, model: Model) => any
  serialize?: (value: any, attribute: string, model: Model) => any
}

export type ModelColumnOptions = ColumnOptions & {
  hasGetter: boolean
  hasSetter: boolean
}

export type ColumnDecorator = (options?: Partial<ColumnOptions>) => DecoratorFn

export type DateColumnDecorator = (
  options?: Partial<ColumnOptions>
) => OptionalTypedDecorator<Dayjs | null>

export type DateTimeColumnDecorator = DateColumnDecorator
