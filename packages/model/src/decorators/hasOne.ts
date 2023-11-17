import { toModel } from '../utils/model'
import type { ModelClass } from '../Model'
import type { OptionalTypedDecorator } from '../types'

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
      map: value => toModel(value, relatedModel(), false),
    })
  }
}

export const related = hasOne
