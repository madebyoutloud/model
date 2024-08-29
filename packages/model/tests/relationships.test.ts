import { describe, expect, it } from 'vitest'
import { Model, hasMany, hasOne } from '../src/index.js'

class A extends Model {
  declare a: string
}

class B extends Model {
  declare b: string

  @hasOne(() => A)
  declare a: A

  @hasOne(() => A)
  declare optionalA?: A | null

  @hasMany(() => A)
  declare list: A[]

  @hasMany(() => A)
  collection = new Collection<A>()
}

class Collection<T> extends Array<T> {
  custom() {
    return true
  }
}

describe('Related', () => {
  it('can map related object', () => {
    const a = A.create({
      a: 'a',
    })

    const b1 = B.create({
      b: 'b',
      a: {
        a: 'a',
      },
    })

    expect(b1.a).toBeInstanceOf(A)
    expect(b1.optionalA).toBeUndefined()
    expect(b1.a).not.toBe(a)
  })

  it('reuses existing mapping', () => {
    const a = A.create({
      a: 'a',
    })

    const b1 = B.create({
      b: 'b',
      a,
    })

    expect(b1.a).toBeInstanceOf(A)
    expect(b1.a).toBe(a)
  })

  it('can map array', () => {
    const a = A.create({ a: 'a' })
    const b1 = B.create({ b: 'b', list: [{ a: 'a' }] })
    const b2 = B.create({ b: 'b', list: [a] })

    expect(b1.list).toBeInstanceOf(Array)
    expect(b1.list.length).toBe(1)
    expect(b1.list.at(0)).toBeInstanceOf(A)
    expect(b1.list.at(0)).not.toBe(a)

    expect(b2.list.at(0)).toBe(a)
  })

  it('can map to custom collection', () => {
    const a = A.create({ a: 'a' })
    const b1 = B.create({ b: 'b', collection: [{ a: 'a' }] })
    const b2 = B.create({ b: 'b', collection: [a] })

    expect(b1.collection).toBeInstanceOf(Collection)
    expect(b1.collection.at(0)).toBeInstanceOf(A)
    expect(b2.collection).toBeInstanceOf(Collection)
    expect(b2.collection.at(0)).toBe(a)

    b1.merge({ collection: [] })
    expect(b1.collection).toBeInstanceOf(Collection)
    expect(b1.collection.custom()).toBe(true)
  })
})
