import type { ModelClass } from '../Model'
import type { OptionalTypedDecorator } from '../types'

export type RelationDecorator = <
  RelatedModel extends ModelClass,
  Result = InstanceType<RelatedModel>,
>(
  model: () => RelatedModel
) => OptionalTypedDecorator<Result | Result[] | null>

export const relation: RelationDecorator = (relatedModel) => {
  return function decorateAsRelation(target, property: string) {
    const Model = target.constructor as ModelClass
    Model.$boot()
    Model.$addRelation(property, relatedModel)
  }
}
