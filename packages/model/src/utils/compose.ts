type Constructor = new (...args: any[]) => {}

/**
 * Normalizes constructor to work with mixins. There is an open bug for mixins
 * to allow constructors other than `...args: any[]`
 *
 * https://github.com/microsoft/TypeScript/issues/37142
 */
export type NormalizeConstructor<T extends Constructor> = {
  new (...args: any[]): InstanceType<T>
} & Omit<T, 'constructor'>

export interface UnaryFunction<T, R> {
  (source: T): R
}

/**
 * Compose a class by applying mixins to it.
 * The code is inspired by https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/, its
 * just that I have added the support for static types too.
 */

export function compose<T extends Constructor>(superclass: T) {
  return new MixinBuilder(superclass)
}

class MixinBuilder<T extends Constructor> {
  constructor(private superclass: T) {}

  with<A>(mixin: UnaryFunction<T, A>): A
  with<A, B>(
    mixin: UnaryFunction<T, A>,
    mixinB: UnaryFunction<A, B>
  ): B
  with<A, B, C>(
    mixin: UnaryFunction<T, A>,
    mixinB: UnaryFunction<A, B>,
    mixinC: UnaryFunction<B, C>
  ): C
  with<A, B, C, D>(
    mixin: UnaryFunction<T, A>,
    mixinB: UnaryFunction<A, B>,
    mixinC: UnaryFunction<B, C>,
    mixinD: UnaryFunction<C, D>
  ): D
  with<A, B, C, D, E>(
    mixin: UnaryFunction<T, A>,
    mixinB: UnaryFunction<A, B>,
    mixinC: UnaryFunction<B, C>,
    mixinD: UnaryFunction<C, D>,
    mixinE: UnaryFunction<D, E>
  ): E
  with< A, B, C, D, E, F>(
    mixin: UnaryFunction<T, A>,
    mixinB: UnaryFunction<A, B>,
    mixinC: UnaryFunction<B, C>,
    mixinD: UnaryFunction<C, D>,
    mixinF: UnaryFunction<E, F>
  ): F
  with<A, B, C, D, E, F, G>(
    mixin: UnaryFunction<T, A>,
    mixinB: UnaryFunction<A, B>,
    mixinC: UnaryFunction<B, C>,
    mixinD: UnaryFunction<C, D>,
    mixinF: UnaryFunction<E, F>,
    mixinG: UnaryFunction<F, G>
  ): G
  with<A, B, C, D, E, F, G, H>(
    mixin: UnaryFunction<T, A>,
    mixinB: UnaryFunction<A, B>,
    mixinC: UnaryFunction<B, C>,
    mixinD: UnaryFunction<C, D>,
    mixinF: UnaryFunction<E, F>,
    mixinG: UnaryFunction<F, G>,
    mixinH: UnaryFunction<G, H>
  ): H
  with< A, B, C, D, E, F, G, H, I>(
    mixin: UnaryFunction<T, A>,
    mixinB: UnaryFunction<A, B>,
    mixinC: UnaryFunction<B, C>,
    mixinD: UnaryFunction<C, D>,
    mixinF: UnaryFunction<E, F>,
    mixinG: UnaryFunction<F, G>,
    mixinH: UnaryFunction<G, H>,
    mixinI: UnaryFunction<H, I>
  ): I
  with(...mixins: UnaryFunction<any, any>[]): UnaryFunction<any, any> {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass) as any
  }
}
