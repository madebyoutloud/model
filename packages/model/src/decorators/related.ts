import { toModel } from '../utils/model'
import type { ModelClass } from '../Model'
import type { OptionalTypedDecorator } from '../types'

export type RelatedDecorator = <
  RelatedModel extends ModelClass,
  Result = InstanceType<RelatedModel>,
>(
  model: () => RelatedModel
) => OptionalTypedDecorator<Result | null>

export const related: RelatedDecorator = (relatedModel) => {
  return function decorateAsRelation(target, property: string) {
    const Model = target.constructor as ModelClass
    Model.$boot()
    Model.$addRelation(property, {
      type: 'related',
      relatedModel,
      map: value => toModel(value, relatedModel(), false),
    })
  }
}
