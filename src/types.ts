import type { Model, ModelClass } from './model.js'

type PartialModelValue<T> = T extends (infer U)[] ? PartialModelValue<U>[] : T extends Model ? ModelValues<T> : T

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

export type ModelValues<T extends Model, Filtered = Pick<T, NonFunctionPropertyNames<T>>> = {
  [K in keyof Filtered]?: PartialModelValue<Filtered[K]>
}

export type ModelObject = Record<string, any>

export type DecoratorFn = (target: any, property: any) => void

export type TypedDecorator<PropType> = <TKey extends string, TTarget extends Record<TKey, PropType>>(
  target: TTarget,
  property: TKey,
) => void

export type OptionalTypedDecorator<PropType> = <TKey extends string, TTarget extends Partial<Record<TKey, PropType>>>(
  target: TTarget,
  property: TKey,
) => void

export interface ColumnOptions {
  meta: Record<string, any>
  deserialize?: (value: any, attribute: string, model: Model) => any
  serialize?: (value: any, attribute: string, model: Model) => any
}

export type ModelColumnOptions = ColumnOptions

export type ColumnDecorator = (options?: Partial<ColumnOptions>) => DecoratorFn

export interface ModelRelationOptions<T extends ModelClass = ModelClass> {
  type: string
  relatedModel: () => T
  map: (value: any, attribute: string, model: Model) => any
}

/**
 * A model class whose constructor accepts any arguments, which TypeScript requires of a mixin's base class.
 *
 * ```ts
 * function Timestamps<T extends NormalizedModel>(Base: T) {
 *   class Timestamps extends Base {}
 *   return Timestamps
 * }
 * ```
 */
export type NormalizedModel = (new (...args: any[]) => InstanceType<ModelClass>) & Omit<ModelClass, 'constructor'>

/**
 * Creates the model from data. The result is nullable only when the data is.
 */
export interface ModelMapper<T extends Model> {
  (data: ModelObject): T
  (data: ModelObject | null | undefined): T | null
}
