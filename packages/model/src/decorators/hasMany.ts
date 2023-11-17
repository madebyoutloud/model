import { toModel } from '../utils/model'
import type { ModelClass } from '../Model'
import type { OptionalTypedDecorator } from '../types'

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
      map: value => toModel(value, relatedModel(), true),
    })
  }
}

export const collection = hasMany
