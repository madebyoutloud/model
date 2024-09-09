import type { ModelClass } from '../model.js'
import type { OptionalTypedDecorator } from '../types.js'

export type HasManyDecorator = <
  RelatedModel extends ModelClass,
  Result = InstanceType<RelatedModel>,
>(
  model: () => RelatedModel
) => OptionalTypedDecorator<Result[] | null>

export const hasMany: HasManyDecorator = (relatedModel) => {
  return function decorateAsRelation(target, property: string) {
    const Model = target.constructor as ModelClass
    Model.$boot()
    Model.$addRelation(property, {
      type: 'hasMany',
      relatedModel,
      map: (value) => relatedModel().map(value, true),
    })
  }
}
