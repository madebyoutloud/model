// import { proxyHandler } from './proxyHandler'
import { column } from './decorators/column.js'
import { relation } from './decorators/relation.js'
import type { ColumnOptions, ModelColumnOptions, ModelMapper, ModelObject, ModelRelationOptions, ModelValues } from './types.js'
import { defineStaticProperty } from './utils/define_static_property.js'

export type ModelClass = typeof Model

export class Model {
  static $isBooted: boolean
  static $columns: Map<string, ModelColumnOptions>
  static $relations: Map<string, ModelRelationOptions>
  static column = column
  static relation = relation

  declare $attributes: ModelObject

  static $boot() {
    if (!Object.hasOwn(this, '$isBooted')) {
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
    options: ModelRelationOptions<T>,
  ) {
    this.$relations.set(name, options)
  }

  static create<T extends ModelClass>(this: T, values: ModelValues<InstanceType<T>>): InstanceType<T> {
    const model = new this() as InstanceType<T>
    model.fill(values)

    return model
  }

  /**
   * Creates the model from plain data, such as an API response. An instance of the model is returned as it is.
   * Pairs with `toJSON()`, so the model fits code that revives classes by `fromJSON()`, such as a Nuxt
   * payload reviver. `null` and `undefined` return `null`.
   */
  static fromJSON<T extends ModelClass>(this: T, values: ModelObject): InstanceType<T>
  static fromJSON<T extends ModelClass>(this: T, values: ModelObject | null | undefined): InstanceType<T> | null
  static fromJSON<T extends ModelClass>(this: T, values: ModelObject | null | undefined): InstanceType<T> | null {
    if (values === null || values === undefined) return null
    if (values instanceof this) return values as InstanceType<T>

    return this.create(values as ModelValues<InstanceType<T>>)
  }

  /**
   * Creates a model from each item of the array. `null` and `undefined` return an empty array.
   */
  static fromArray<T extends ModelClass>(this: T, items: ModelObject[] | null | undefined): InstanceType<T>[] {
    if (items === null || items === undefined) return []

    return items.map(item => this.fromJSON(item))
  }

  /**
   * Returns a function that creates the model from data, for `transform` options and `.then()`.
   * `null` and `undefined` return `null`.
   */
  static mapperJSON<T extends ModelClass>(this: T): ModelMapper<InstanceType<T>> {
    return ((data: ModelObject | null | undefined) => this.fromJSON(data)) as ModelMapper<InstanceType<T>>
  }

  /**
   * Returns a function that creates a model from each item of the array, for `transform` options and `.then()`.
   * `null` and `undefined` return an empty array.
   */
  static mapperArray<T extends ModelClass>(this: T): (data: ModelObject[] | null | undefined) => InstanceType<T>[] {
    return data => this.fromArray(data)
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

  fill(values: ModelValues<this>) {
    // this.$attributes = {}
    this.merge(values)

    return this
  }

  merge(values: ModelValues<this>) {
    const anyThis = this as any
    const model = this.constructor as ModelClass

    Object.keys(values).forEach((key) => {
      let value = values[key as keyof typeof values]

      if (model.$relations.has(key)) {
        value = model.$relations.get(key)!.map(value, key, this)

        // do not replace array if exists, just clear it and insert new records
        // this allows using custom collection where you extend Array
        if (Array.isArray(anyThis[key])) {
          anyThis[key].splice(0, anyThis[key].length, ...(value as any[]))
          return
        }
      } else if (model.$columns.has(key)) {
        const column = model.$columns.get(key)!

        if (column.deserialize) {
          value = column.deserialize(value, key, this)
        }
      }

      anyThis[key] = value
    })

    return this
  }

  serialize(): ModelObject {
    const model = this.constructor as ModelClass
    const anyThis = this as any

    return Object.keys(this).reduce<ModelObject>((obj, key) => {
      let value = anyThis[key]

      if (model.$relations.has(key)) {
        if (Array.isArray(value)) {
          value = value.map((item) => item.serialize())
        } else if (value) {
          value = value.serialize()
        }
      } else if (model.$columns.has(key)) {
        const column = model.$columns.get(key)!

        if (column.serialize) {
          value = column.serialize(value, key, this)
        }
      } else if (typeof value === 'object') {
        value = JSON.parse(JSON.stringify(value))
      }

      obj[key] = value

      return obj
    }, {})
  }

  toJSON() {
    return this.serialize()
  }

  clone(): this {
    const model = this.constructor as ModelClass
    return model.create(this.serialize()) as this
  }
}

