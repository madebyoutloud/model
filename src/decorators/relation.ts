import type { ModelClass } from '../model.js'
import type { OptionalTypedDecorator } from '../types.js'

export interface RelationOptions<Many extends boolean = boolean> {
  /** The property holds an array of related models. */
  many?: Many
}

export type RelationDecorator = <
  RelatedModel extends ModelClass,
  Many extends boolean = false,
  Result = InstanceType<RelatedModel>,
>(
  model: () => RelatedModel,
  options?: RelationOptions<Many>,
) => OptionalTypedDecorator<Many extends true ? Result[] : Result | null>

/**
 * Creates the related model, or with `{ many: true }` an array of them, whenever the property is filled.
 * `null` and `undefined` become `null`, or an empty array with `many`.
 */
export const relation: RelationDecorator = (relatedModel, options = {}) => {
  const many = options.many === true

  return function decorateAsRelation(target, property: string) {
    const Model = target.constructor as ModelClass
    Model.$boot()
    Model.$addRelation(property, {
      type: many ? 'hasMany' : 'hasOne',
      relatedModel,
      map: (value) => (many ? relatedModel().fromArray(value) : relatedModel().fromJSON(value)),
    })
  }
}

/**
 * @deprecated Use `@relation(() => Model)`.
 */
export function hasOne<RelatedModel extends ModelClass>(model: () => RelatedModel) {
  return relation(model)
}

/**
 * @deprecated Use `@relation(() => Model, { many: true })`.
 */
export function hasMany<RelatedModel extends ModelClass>(model: () => RelatedModel) {
  return relation(model, { many: true })
}
