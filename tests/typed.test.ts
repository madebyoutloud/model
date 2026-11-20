import { describe, expect, expectTypeOf, it } from 'vitest'
import { Model, type TypedMethod, column, relation } from '../src/index.js'

// Shapes as generated from an OpenAPI spec: dates are strings, relations plain objects.
interface OwnerData {
  id: string
  email: string
}

interface ProviderData {
  id: string
  name: string
  enabled: boolean
  createdAt: string
  owner: OwnerData | null
}

class Owner extends Model.typed<OwnerData>() {}

class Provider extends Model.typed<Omit<ProviderData, 'createdAt'>>() {
  @column.dateTime()
  declare createdAt: Date

  @relation(() => Owner)
  declare owner: Owner | null

  get label() {
    return `${this.name} (${this.id})`
  }
}

abstract class RestModel extends Model {
  declare static typed: TypedMethod<typeof RestModel>

  static endpoint: string
  abstract id: string

  get $endpoint() {
    return `${(this.constructor as typeof RestModel).endpoint}/${this.id}`
  }
}

class Project extends RestModel.typed<{ id: string; title: string }>() {
  static override endpoint = 'v1/projects'
}

describe('typed', () => {
  it('returns the class itself', () => {
    expect(Model.typed<OwnerData>()).toBe(Model)
    expect(Object.getPrototypeOf(Owner)).toBe(Model)
  })

  it('types instances with the data', () => {
    const provider = Provider.fromJSON({
      id: '1',
      name: 'GitHub',
      enabled: true,
      createdAt: '2024-01-15T10:00:00.000Z',
      owner: { id: '2', email: 'a@b.c' },
    })

    expect(provider).toBeInstanceOf(Provider)
    expect(provider.label).toBe('GitHub (1)')
    expect(provider.createdAt).toBeInstanceOf(Date)
    expect(provider.owner).toBeInstanceOf(Owner)

    expectTypeOf(provider).toEqualTypeOf<Provider>()
    expectTypeOf(provider.name).toEqualTypeOf<string>()
    expectTypeOf(provider.enabled).toEqualTypeOf<boolean>()
    expectTypeOf(provider.createdAt).toEqualTypeOf<Date>()
    expectTypeOf(provider.owner).toEqualTypeOf<Owner | null>()
    expectTypeOf(Provider.fromArray([])).toEqualTypeOf<Provider[]>()
    expectTypeOf(Provider.create({ name: 'GitHub' })).toEqualTypeOf<Provider>()
    // @ts-expect-error name is a string
    Provider.create({ name: 1 })
  })

  it('keeps a base class with a redeclared typed', () => {
    const project = Project.fromJSON({ id: '7', title: 'Site' })

    expect(project).toBeInstanceOf(RestModel)
    expect(project.$endpoint).toBe('v1/projects/7')

    expectTypeOf(project.title).toEqualTypeOf<string>()
    expectTypeOf(project.$endpoint).toEqualTypeOf<string>()
    expectTypeOf(Project.endpoint).toEqualTypeOf<string>()
  })

  it('takes a subclass as the second type argument', () => {
    class Task extends RestModel.typed<{ id: string; done: boolean }>() {}
    class Issue extends Project.typed<{ labels: string[] }, typeof Project>() {}

    const issue = Issue.fromJSON({ id: '1', title: 'Bug', labels: ['a'] })

    expectTypeOf(Task.fromJSON({}).done).toEqualTypeOf<boolean>()
    expectTypeOf(issue.labels).toEqualTypeOf<string[]>()
    expectTypeOf(issue.title).toEqualTypeOf<string>()
    expect(issue.$endpoint).toBe('v1/projects/1')
  })
})
