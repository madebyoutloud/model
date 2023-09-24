// import { proxyHandler } from './proxyHandler'
import type { ColumnOptions, ModelColumnOptions, ModelValues } from './types'
import type { NormalizeConstructor } from './utils/compose'
import { defineStaticProperty } from './utils/defineStaticProperty'
import { toModel } from './utils/model'

export type ModelClass = typeof Model
export type NormalizedModel = NormalizeConstructor<ModelClass>

export interface ModelObject {
  [key: string]: any
}

export class Model {
  static $isBooted: boolean
  static $columns: Map<string, ModelColumnOptions>
  static $relations: Map<string, () => ModelClass>

  $attributes: ModelObject

  static $boot() {
    if (!this.hasOwnProperty('$isBooted')) {
      this.$isBooted = false
    }

    if (this.$isBooted) {
      return
    }

    this.$isBooted = true
    this.$onBoot()
  }

  static $onBoot() {
    this.$defineProperty('$columns', new Map(), 'inherit')
    this.$defineProperty('$relations', new Map(), 'inherit')
  }

  // Model extends LucidModel
  static $defineProperty<Model = any, Prop extends keyof Model = any>(
    this: Model,
    propertyName: Prop,
    defaultValue: Model[Prop],
    strategy: 'inherit' | 'define' | ((value: Model[Prop]) => Model[Prop]),
  ) {
    defineStaticProperty(this as any, Model, {
      propertyName,
      defaultValue,
      strategy,
    })
  }

  static $addColumn(name: string, options: Partial<ColumnOptions>) {
    const descriptor = Object.getOwnPropertyDescriptor(this.prototype, name)

    const column: ModelColumnOptions = {
      serialize: options.serialize,
      deserialize: options.deserialize,
      meta: options.meta ?? {},
      hasGetter: !!(descriptor && descriptor.get),
      hasSetter: !!(descriptor && descriptor.set),
    }

    this.$columns.set(name, column)

    return column
  }

  static $addRelation<T extends ModelClass>(
    name: string,
    relatedModel: () => T,
  ) {
    this.$relations.set(name, relatedModel)
  }

  public static create<T extends ModelClass>(this: T, values: ModelValues<InstanceType<T>>): InstanceType<T> {
    const model = new this() as InstanceType<T>
    model.fill(values)

    return model
  }

  constructor() {
    const model = this.constructor as ModelClass
    model.$boot()

    Object.defineProperty(this, '$attributes', {
      enumerable: false,
      value: {},
    })

    // return new Proxy(this, proxyHandler)
  }

  private $createRelation(key: string, value: any) {
    const model = this.constructor as ModelClass
    const relation = model.$relations.get(key)

    return toModel(value, relation!())
  }

  public fill(values: ModelValues<this>) {
    // this.$attributes = {}
    Object.assign(this, values)
    this.merge(values)

    return this
  }

  public merge(values: ModelValues<this>) {
    const anyValues = values as any
    const anyThis = this as any
    const model = this.constructor as ModelClass

    Object.keys(values).forEach((key) => {
      let value = anyValues[key]

      if (model.$relations.has(key)) {
        value = this.$createRelation(key, value)
      }
      else if (model.$columns.has(key)) {
        const column = model.$columns.get(key)!

        if (column.deserialize) {
          value = column.deserialize(value, key, this)
        }
      }

      anyThis[key] = value
    })

    return this
  }

  public serialize(): ModelObject {
    const model = this.constructor as ModelClass
    const anyThis = this as any

    return Object.keys(this).reduce<ModelObject>((obj, key) => {
      let value = anyThis[key]

      if (model.$relations.has(key)) {
        if (Array.isArray(value)) {
          value = value.map(item => item.serialize())
        }
        else if (value) {
          value = value.serialize()
        }
      }
      else if (model.$columns.has(key)) {
        const column = model.$columns.get(key)!

        if (column.serialize) {
          value = column.serialize(value, key, this)
        }
      }
      else if (typeof value === 'object') {
        value = JSON.parse(JSON.stringify(value))
      }

      obj[key] = value

      return obj
    }, {})
  }

  public toJSON() {
    return this.serialize()
  }

  public clone(): this {
    const model = this.constructor as ModelClass
    return model.create(this.serialize()) as this
  }
}
