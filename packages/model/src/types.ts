import type { Model, ModelClass } from './model.js'

type PartialModelValue<T> = T extends (infer U)[]
  ? PartialModelValue<U>[]
  : T extends Model
    ? ModelValues<T>
    : T

type NonFunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T]

export type ModelValues<
  T extends Model,
  Filtered = Pick<T, NonFunctionPropertyNames<T>>,
> = {
  [K in keyof Filtered]?: PartialModelValue<Filtered[K]>
}

export type ModelObject = Record<string, any>

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

export interface ColumnOptions {
  meta: Record<string, any>
  deserialize?: (value: any, attribute: string, model: Model) => any
  serialize?: (value: any, attribute: string, model: Model) => any
}

export type ModelColumnOptions = ColumnOptions & {
  hasGetter: boolean
  hasSetter: boolean
}

export type ColumnDecorator = (options?: Partial<ColumnOptions>) => DecoratorFn

export interface ModelRelationOptions<T extends ModelClass = ModelClass> {
  type: string
  relatedModel: () => T
  map: (value: any, attribute: string, model: Model) => any
}
