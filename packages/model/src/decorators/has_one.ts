import type { ModelClass } from '../model.js'
import type { OptionalTypedDecorator } from '../types.js'

export type HasOneDecorator = <
  RelatedModel extends ModelClass,
  Result = InstanceType<RelatedModel>,
>(
  model: () => RelatedModel
) => OptionalTypedDecorator<Result | null>

export const hasOne: HasOneDecorator = (relatedModel) => {
  return function decorateAsRelation(target, property: string) {
    const Model = target.constructor as ModelClass
    Model.$boot()
    Model.$addRelation(property, {
      type: 'hasOne',
      relatedModel,
      map: relatedModel().mapper(),
    })
  }
}
