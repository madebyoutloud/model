// https://github.com/poppinss/utils/blob/develop/src/defineStaticProperty.ts

import { clone } from './clone'

type Constructor = new (...args: any[]) => any
type AbstractConstructor = abstract new (...args: any[]) => any

/**
 * Define static properties on a class with inheritance in play.
 */
export function defineStaticProperty<
  T extends Constructor | AbstractConstructor,
  Prop extends keyof T,
>(
  self: T,
  BaseClass: Constructor | AbstractConstructor,
  {
    propertyName,
    defaultValue,
    strategy,
  }: {
    propertyName: Prop
    defaultValue: T[Prop]
    strategy: 'inherit' | 'define' | ((value: T[Prop]) => T[Prop])
  },
) {
  if (self.hasOwnProperty(propertyName)) {
    return
  }

  /**
     * Class is inhering the base class directly and hence we don't have to
     * copy any properties
     */
  if (Object.getPrototypeOf(self.prototype) === BaseClass.prototype || strategy === 'define') {
    Object.defineProperty(self, propertyName, {
      value: defaultValue,
      configurable: true,
      enumerable: true,
      writable: true,
    })
    return
  }

  /**
   * Class is inherting another sub class. We must copy the values to the self
   * class, otherwise mutating them inside the self class will be reflected
   * on the base class.
   */
  const value = self[propertyName]
  if (value === undefined) {
    Object.defineProperty(self, propertyName, {
      value: defaultValue,
      configurable: true,
      enumerable: true,
      writable: true,
    })
    return
  }

  Object.defineProperty(self, propertyName, {
    value: typeof strategy === 'function' ? strategy(value) : clone(value),
    configurable: true,
    enumerable: true,
    writable: true,
  })
}
