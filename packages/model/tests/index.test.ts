import { describe, expect, test } from 'vitest'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { Model, column, compose, relation, toModel } from '../src'
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

  @column()
  order: number

  @column.dateTime({})
  createdAt: Dayjs
}

class Composed extends compose(Extended).with(Enumerable, Timestamps) {
  @enumeration('test')
  type: string
}

class Relation extends Model {
  id: number

  @relation(() => Test)
  test?: Test

  @relation(() => Test)
  tests?: Test[]
}

describe('@outloud/model', () => {
  test('create model', () => {
    const value = 'hello'
    const test = Test.create({
      value,
    })

    expect(test.value).toBe(value)
  })

  test('merge values', () => {
    const value = 'hello'
    const test = new Test()

    expect(test.value).toBeUndefined()

    test.merge({ value })
    expect(test.value).toBe(value)
  })

  test('extends model', () => {
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

  test('serialize model', () => {
    const values = {
      value: 'extended',
      name: 'test',
    }

    const test = Test.create({ ...values })

    expect(test.serialize()).toEqual(values)
    expect(test.toJSON()).toEqual(values)
  })

  test('clone model', () => {
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

  test('compose', () => {
    const record = Composed.create({
      createdAt: dayjs(),
      type: 'test',
    })

    expect(record.createdAt).toBeTruthy()
    expect(record.type).toBe('test')
    expect(Composed.$getEnumerationNames()).toContain('test')
  })

  test('deserialize values', () => {
    const record = Extended.create({
      createdAt: new Date().toISOString(),
    } as any)

    expect(record.createdAt).toBeTypeOf('object')
    expect(record.createdAt.year()).toBeTypeOf('number')
  })

  test('relation', () => {
    const plain = Relation.create({
      id: 123,
    })

    const relation = Relation.create({
      id: 123,
      test: {
        name: 'john',
      },
      tests: [{
        name: 'john',
      }],
    })

    expect(plain.test).toBeUndefined()
    expect(relation.test).toBeInstanceOf(Test)
    expect(relation.test?.name).toBe('john')
    expect(relation.test?.fullName).toBe('john')
    expect(relation.tests?.length).toBe(1)
    expect(relation.tests?.at(0)?.name).toBe('john')
    expect(relation.tests?.at(0)?.fullName).toBe('john')
  })

  test('toModel', () => {
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
