import { describe, expect, it } from 'vitest'
import dayjs, { type Dayjs } from 'dayjs'
import { Model, column, compose, config, configure } from '../src/index.js'
import { Enumerable, Timestamps, enumeration } from './utils.js'

class Test extends Model {
  declare value: string

  @column()
  declare name: string | null

  get fullName() {
    return this.name
  }
}

class DateTest extends Model {
  @column.dateTime()
  declare createdAt: Dayjs
}

class Extended extends Test {
  declare isExtended: boolean
  declare nested: { value: string }

  @column()
  declare order: number

  @column.dateTime()
  declare createdAt: Date
}

class Composed extends compose(Extended).with(Enumerable, Timestamps) {
  @enumeration('test')
  declare type: string
}

describe('Model', () => {
  it('should create model', () => {
    const value = 'hello'
    const test = Test.create({
      value,
    })

    expect(test.value).toBe(value)
  })

  it('should merge values', () => {
    const value = 'hello'
    const test = new Test()

    expect(test.value).toBeUndefined()

    test.merge({ value })
    expect(test.value).toBe(value)
  })

  it('should extend model', () => {
    const value = 'extended'
    const name = 'test'
    const extended = Extended.create({
      value,
      name,
      isExtended: true,
      createdAt: dayjs(),
    })

    expect(extended.value).toBe(value)
    expect(extended.name).toBe(name)
    expect(extended.isExtended).toBe(true)
    expect(extended.createdAt).toBeTypeOf('object')
  })

  it('should serialize model', () => {
    const values = {
      value: 'extended',
      name: 'test',
    }

    const test = Test.create({ ...values })

    expect(test.serialize()).toEqual(values)
    expect(test.toJSON()).toEqual(values)
  })

  it('should clone model', () => {
    const values = {
      value: 'extended',
      name: 'test',
    }

    const test = Test.create({ ...values })
    const clone = test.clone()

    expect(test).not.toBe(clone)
    expect(clone.value).toBe(values.value)

    clone.value = 'changed'
    expect(clone.value).toBe('changed')
    expect(test.value).toBe(values.value)
  })

  it('should compose traits', () => {
    const record = Composed.create({
      createdAt: new Date(),
      type: 'test',
    })

    expect(record.createdAt).toBeTruthy()
    expect(record.type).toBe('test')
    expect(Composed.$getEnumerationNames()).toContain('test')
  })

  it('should deserialize values', () => {
    const record = Extended.fromJSON({
      createdAt: new Date().toISOString(),
    })

    expect(record.createdAt).toBeTypeOf('object')
    expect(record.createdAt).toBeInstanceOf(Date)
  })

  it('should parse/format dates', () => {
    const originalOptions = config.date

    configure({
      date: {
        deserialize: (value) => dayjs(value),
        serialize: (value: Dayjs) => value.toDate(),
      },
    })

    const createdAt = new Date().toISOString()

    const record = DateTest.fromJSON({
      createdAt,
    })

    const serialized = record.serialize()

    expect(record.createdAt).toBeTypeOf('object')
    expect(record.createdAt.year()).toBeTypeOf('number')
    expect(record.createdAt.toISOString()).toBe(createdAt)

    expect(serialized.createdAt).toBeTypeOf('string')
    expect(serialized.createdAt).toBe(createdAt)

    configure({ date: originalOptions })
  })

  it('should map to model', () => {
    const test = Test.map({
      value: 'test',
    })

    const tests = Test.map([
      {
        value: 'test',
      },
    ])

    const mapped = Test.create({})

    expect(test).toBeInstanceOf(Test)
    expect(tests.length).toBe(1)
    expect(tests.at(0)).toBeInstanceOf(Test)
    expect(mapped).toBe(Test.map(mapped))
  })

  it('should create mapper to model', () => {
    const toArray = Test.mapper('array')
    const toModel = Test.mapper('model')

    expect(toArray([{}]).at(0)).toBeInstanceOf(Test)
    expect(toModel({})).toBeInstanceOf(Test)
  })
})
