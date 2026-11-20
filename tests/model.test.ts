import { describe, expect, expectTypeOf, it } from 'vitest'
import dayjs, { type Dayjs } from 'dayjs'
import { Model, column, config, configure } from '../src/index.js'
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

class Composed extends Enumerable(Timestamps(Extended)) {
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
      createdAt: new Date(),
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
    const originalOptions = { ...config.date }

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

    const serialized = record.toJSON()

    expect(record.createdAt).toBeTypeOf('object')
    expect(record.createdAt.year()).toBeTypeOf('number')
    expect(record.createdAt.toISOString()).toBe(createdAt)

    expect(serialized.createdAt).toBeTypeOf('string')
    expect(serialized.createdAt).toBe(createdAt)

    configure({ date: originalOptions })
  })

  it('should create from object and array', () => {
    const test = Test.fromJSON({ value: 'test' })
    const tests = Test.fromArray([{ value: 'test' }])

    expect(test).toBeInstanceOf(Test)
    expect(test.value).toBe('test')
    expect(tests.length).toBe(1)
    expect(tests.at(0)).toBeInstanceOf(Test)
    expect(Test.fromJSON(test)).toBe(test)
  })

  it('should map null and undefined', () => {
    const nullable = null as { value: string } | null
    const missing = undefined as { value: string }[] | undefined

    expect(Test.fromJSON(nullable)).toBeNull()
    expect(Test.fromJSON(undefined)).toBeNull()
    expect(Test.fromArray(missing)).toEqual([])
    expect(Test.fromArray(null)).toEqual([])
    expect(Test.mapperJSON()(nullable)).toBeNull()
    expect(Test.mapperArray()(missing)).toEqual([])

    expectTypeOf(Test.fromJSON({ value: 'test' })).toEqualTypeOf<Test>()
    expectTypeOf(Test.fromJSON({} as any)).toEqualTypeOf<Test>()
    expectTypeOf(Test.fromJSON(nullable)).toEqualTypeOf<Test | null>()
    expectTypeOf(Test.fromArray(missing)).toEqualTypeOf<Test[]>()
    expectTypeOf(Test.mapperJSON()({})).toEqualTypeOf<Test>()
    expectTypeOf(Test.mapperJSON()(nullable)).toEqualTypeOf<Test | null>()
  })

  it('should create from JSON', () => {
    const test = Test.fromJSON({ value: 'test' })

    expect(test).toBeInstanceOf(Test)
    expect(Test.fromJSON(JSON.parse(JSON.stringify(test)))).toEqual(test)
    expect(Test.fromJSON(test)).toBe(test)
  })

  it('should create mappers', () => {
    const toModel = Test.mapperJSON()
    const toArray = Test.mapperArray()

    const test: Test = toModel({ value: 'test' })
    const tests: Test[] = toArray([{}])

    expect(test).toBeInstanceOf(Test)
    expect(tests.at(0)).toBeInstanceOf(Test)
  })

  it('should define columns through the model', () => {
    class Static extends Model {
      @Model.column.dateTime()
      declare createdAt: Date
    }

    const record = Static.fromJSON({ createdAt: new Date().toISOString() })

    expect(record.createdAt).toBeInstanceOf(Date)
  })

  it('should skip data for getters without a setter', () => {
    class WithGetters extends Test {
      declare first: string

      get label() {
        return `${this.first}!`
      }

      get editable() {
        return this.first
      }

      set editable(value: string) {
        this.first = value
      }
    }

    const record = WithGetters.fromJSON({ first: 'a', label: 'from api', fullName: 'from api', editable: 'b' })

    expect(record.label).toBe('b!')
    expect(record.fullName).toBeUndefined()
    expect(record.first).toBe('b')
  })

  it('should keep the day of a date in every time zone', () => {
    class DateOnly extends Model {
      @column.date()
      declare day: Date
    }

    const original = process.env.TZ

    try {
      for (const tz of ['America/Los_Angeles', 'UTC', 'Europe/Bratislava', 'Pacific/Auckland']) {
        process.env.TZ = tz
        const record = DateOnly.fromJSON({ day: '2024-01-15' })

        expect(record.day.getDate()).toBe(15)
        expect(record.toJSON().day).toBe('2024-01-15')
      }
    } finally {
      process.env.TZ = original
    }
  })
})
