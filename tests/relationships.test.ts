import { describe, expect, it } from 'vitest'
import { Model, hasMany, hasOne, relation } from '../src/index.js'

class A extends Model {
  declare a: string
}

class Collection<T> extends Array<T> {
  custom() {
    return true
  }
}

class B extends Model {
  declare b: string

  @relation(() => A)
  declare a: A

  @relation(() => A)
  declare optionalA?: A | null

  @relation(() => A, { many: true })
  declare list: A[]

  @relation(() => A, { many: true })
  collection = new Collection<A>()

  @Model.relation(() => A)
  declare viaModel: A | null
}

class Legacy extends Model {
  @hasOne(() => A)
  declare a: A | null

  @hasMany(() => A)
  declare list: A[]
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

  it('maps null and undefined', () => {
    const b = B.fromJSON({ a: null, optionalA: undefined, list: null, viaModel: null })

    expect(b.a).toBeNull()
    expect(b.optionalA).toBeNull()
    expect(b.list).toEqual([])
    expect(b.viaModel).toBeNull()
  })

  it('keeps custom collection on null', () => {
    const b = B.create({ collection: [{ a: 'a' }] })

    b.merge({ collection: null } as any)
    expect(b.collection).toBeInstanceOf(Collection)
    expect(b.collection.length).toBe(0)
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

  it('serializes relations', () => {
    const b = B.fromJSON({ b: 'b', a: { a: 'a' }, list: [{ a: 'a' }] })

    expect(B.fromJSON(JSON.parse(JSON.stringify(b)))).toEqual(b)
  })

  it('supports deprecated hasOne and hasMany', () => {
    const legacy = Legacy.fromJSON({ a: { a: 'a' }, list: [{ a: 'a' }] })

    expect(legacy.a).toBeInstanceOf(A)
    expect(legacy.list.at(0)).toBeInstanceOf(A)
    expect(Legacy.fromJSON({ a: null, list: null })).toMatchObject({ a: null, list: [] })
  })
})
