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
    const column: ModelColumnOptions = {
      serialize: options.serialize,
      deserialize: options.deserialize,
      meta: options.meta ?? {},
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
    return new this().merge(values) as InstanceType<T>
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
  }

  /**
   * Updates the given values, keeping the others. Keys that only have a getter on the model are skipped, so data
   * with a field named like a getter doesn't throw.
   */
  merge(values: ModelValues<this>) {
    const anyThis = this as any
    const model = this.constructor as ModelClass
    const getters = getterOnlyKeys(model)

    Object.keys(values).forEach((key) => {
      if (getters.has(key)) return

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

  /**
   * Returns the model as plain data: columns serialized, relations as plain objects.
   */
  toJSON(): ModelObject {
    const model = this.constructor as ModelClass
    const anyThis = this as any

    return Object.keys(this).reduce<ModelObject>((obj, key) => {
      let value = anyThis[key]

      if (model.$relations.has(key)) {
        if (Array.isArray(value)) {
          value = value.map(toJSON)
        } else if (value) {
          value = toJSON(value)
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

  /**
   * Returns a new instance with the same data, through `toJSON()`.
   */
  clone(): this {
    const model = this.constructor as ModelClass
    return model.create(this.toJSON()) as this
  }
}

function toJSON(value: any) {
  return typeof value?.toJSON === 'function' ? value.toJSON() : value
}

const getterOnlyCache = new WeakMap<ModelClass, Set<string>>()

/**
 * Names of properties the model's classes define with a getter and no setter, which can't be assigned.
 */
function getterOnlyKeys(model: ModelClass) {
  let keys = getterOnlyCache.get(model)
  if (keys) return keys

  keys = new Set()
  const seen = new Set<string>()

  for (let proto = model.prototype; proto && proto !== Object.prototype; proto = Object.getPrototypeOf(proto)) {
    for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(proto))) {
      if (seen.has(key)) continue
      seen.add(key)

      if (descriptor.get && !descriptor.set) keys.add(key)
    }
  }

  getterOnlyCache.set(model, keys)
  return keys
}

