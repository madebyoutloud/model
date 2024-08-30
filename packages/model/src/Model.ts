// import { proxyHandler } from './proxyHandler'
import type { ColumnOptions, ModelColumnOptions, ModelObject, ModelRelationOptions, ModelValues } from './types.js'
import type { NormalizeConstructor } from './utils/compose.js'
import { defineStaticProperty } from './utils/define_static_property.js'

export type ModelClass = typeof Model
export type NormalizedModel = NormalizeConstructor<ModelClass>

type MapReturnType<
  T extends ModelClass,
  Data extends ModelObject | ModelObject[] | null | undefined,
  ToArray extends boolean | undefined = undefined,
> = ToArray extends true
  ? InstanceType<T>[]
  : ToArray extends false
    ? (Data extends ModelObject ? InstanceType<T> : InstanceType<T> | null)
    : Data extends any[]
      ? InstanceType<T>[]
      : Data extends ModelObject
        ? InstanceType<T>
        : Data extends ModelObject | null | undefined
          ? InstanceType<T> | null
          : InstanceType<T> | InstanceType<T>[] | null

type MapperFormat = 'array' | 'model' | 'nullable'

type MapperReturnType<T extends ModelClass, Format extends MapperFormat> = Format extends 'array'
  ? (data: any[]) => InstanceType<T>[]
  : Format extends 'model'
    ? (data: any) => InstanceType<T>
    : (data: any) => InstanceType<T> | null

export class Model {
  static $isBooted: boolean
  static $columns: Map<string, ModelColumnOptions>
  static $relations: Map<string, ModelRelationOptions>

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

  static fromJSON<T extends ModelClass>(this: T, values: ModelObject): InstanceType<T> {
    if (values instanceof this) {
      return values as InstanceType<T>
    }

    return this.create(values as ModelValues<InstanceType<T>>)
  }

  static map<
    T extends ModelClass,
    Data extends ModelObject | ModelObject[] | null | undefined = undefined,
    ToArray extends boolean | undefined = undefined,
  >(this: T, data?: Data, toArray?: ToArray): MapReturnType<T, Data, ToArray>

  static map<T extends ModelClass>(this: T, data?: any, toArray?: boolean): InstanceType<T>[] | InstanceType<T> | null {
    if (toArray === false && Array.isArray(data)) {
      data = data[0]
    } else if (toArray === true && !Array.isArray(data)) {
      data = data ? [data] : []
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.fromJSON(item))
    }

    if (data === null || data === undefined) {
      return null
    }

    return this.fromJSON(data)
  }

  static mapper<
    T extends ModelClass,
    Format extends MapperFormat,
    >(this: T, format: Format): MapperReturnType<T, Format>
  static mapper<T extends ModelClass>(this: T, format: MapperFormat): (...args: any[]) => any {
    if (format === 'array') {
      return (data: any[]) => this.map(data, true)
    }

    return (data: any) => this.map(data, false)
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
