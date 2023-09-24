import { describe, expect, it } from 'vitest'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { Model, column, compose, toModel } from '../src'
import { Enumerable, Timestamps, enumeration } from './utils'

class Test extends Model {
  value: string

  @column()
  name: string | null

  public get fullName() {
    return this.name
  }
}

class Extended extends Test {
  public isExtended: boolean

  public nested: { value: string }

  @column()
  order: number

  @column.dateTime({})
  createdAt: Dayjs
}

class Composed extends compose(Extended).with(Enumerable, Timestamps) {
  @enumeration('test')
  type: string
}

describe('@outloud/model', () => {
  it('create model', () => {
    const value = 'hello'
    const test = Test.create({
      value,
    })

    expect(test.value).toBe(value)
  })

  it('merge values', () => {
    const value = 'hello'
    const test = new Test()

    expect(test.value).toBeUndefined()

    test.merge({ value })
    expect(test.value).toBe(value)
  })

  it('extends model', () => {
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

  it('serialize model', () => {
    const values = {
      value: 'extended',
      name: 'test',
    }

    const test = Test.create({ ...values })

    expect(test.serialize()).toEqual(values)
    expect(test.toJSON()).toEqual(values)
  })

  it('clone model', () => {
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

  it('compose', () => {
    const record = Composed.create({
      createdAt: dayjs(),
      type: 'test',
    })

    expect(record.createdAt).toBeTruthy()
    expect(record.type).toBe('test')
    expect(Composed.$getEnumerationNames()).toContain('test')
  })

  it('deserialize values', () => {
    const record = Extended.create({
      createdAt: new Date().toISOString(),
    } as any)

    expect(record.createdAt).toBeTypeOf('object')
    expect(record.createdAt.year()).toBeTypeOf('number')
  })

  it('toModel', () => {
    const test = toModel({
      value: 'test',
    }, Test)

    const tests = toModel([{
      value: 'test',
    }], Test)

    const mapped = Test.create({})

    expect(test).toBeInstanceOf(Test)
    expect(tests.length).toBe(1)
    expect(tests.at(0)).toBeInstanceOf(Test)
    expect(mapped).toBe(toModel(mapped, Test))
  })
})
