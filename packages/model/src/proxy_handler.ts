// import type { ModelClass } from './Model'

export const proxyHandler = {
  // get(target: any, key: any, receiver: any) {
  //   const Model = target.constructor as ModelClass
  //   const column = Model.$columns.get(key)

  //   if (column && !column.hasGetter) {
  //     const attributeValue = target.$getAttribute(key)
  //     if (attributeValue === undefined) {
  //       return Reflect.get(target, key, receiver)
  //     }

  //     return attributeValue
  //   }

  //   const relation = Model.$getRelation(key)
  //   if (relation) {
  //     return target.$getRelated(key)
  //   }

  //   return Reflect.get(target, key, receiver)
  // },

  // set(target: any, key: any, value: any, receiver: any) {
  //   const Model = target.constructor as ModelClass
  //   const column = Model.$columns.get(key)

  //   if (column && !column.hasSetter) {
  //     target.$setAttribute(key, value)
  //     Reflect.set(target, key, value, receiver)
  //     return true
  //   }

  //   const relation = Model.$getRelation(key)
  //   if (relation) {
  //     target.$setRelated(key, value)
  //     return true
  //   }

  //   return Reflect.set(target, key, value, receiver)
  // },

  // defineProperty(target: any, key: any, value: any) {
  //   const Model = target.constructor as LucidModel
  //   const column = Model.$getColumn(key)

  //   if (column && !column.hasSetter && value.value !== undefined) {
  //     target.$setAttribute(key, value.value)
  //   }

  //   return Reflect.defineProperty(target, key, value)
  // },
}
