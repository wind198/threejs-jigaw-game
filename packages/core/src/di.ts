import 'reflect-metadata';

export type Class<T = unknown> = new (...args: any[]) => T;
export type Token<T = unknown> = Class<T> | symbol | string;
export type Provider<T = unknown> =
  | Class<T>
  | { provide: Token<T>; useClass: Class<T> }
  | { provide: Token<T>; useValue: T }
  | { provide: Token<T>; useFactory: (...deps: any[]) => T | Promise<T>; inject?: readonly Token[] };

export interface ModuleMetadata {
  imports?: readonly Class[];
  providers?: readonly Provider[];
  exports?: readonly Token[];
}
const moduleKey = Symbol('three-shell:module');
const injectKey = Symbol('three-shell:inject:overrides');
const injectableKey = Symbol('three-shell:injectable');

/** Uses TypeScript legacy decorator metadata, just like classic NestJS DI. */
export function Injectable(): ClassDecorator {
  return target => { Reflect.defineMetadata(injectableKey, true, target); };
}
export function Module(meta: ModuleMetadata): ClassDecorator {
  return target => { Reflect.defineMetadata(moduleKey, meta, target); };
}
/** Explicit token for interfaces, abstract concepts, or host-provided values. */
export function Inject(token: Token): ParameterDecorator {
  return (target, _property, index) => {
    const ctor = target as Class;
    const previous = (Reflect.getOwnMetadata(injectKey, ctor) as Map<number, Token> | undefined) ?? new Map<number, Token>();
    previous.set(index, token);
    Reflect.defineMetadata(injectKey, previous, ctor);
  };
}
export const SceneModule = Module;
export function moduleMetadata(type: Class): ModuleMetadata | undefined {
  return Reflect.getOwnMetadata(moduleKey, type) as ModuleMetadata | undefined;
}
export function tokenName(token: Token): string {
  return typeof token === 'function' ? token.name : String(token);
}
export function providerToken(provider: Provider): Token {
  return typeof provider === 'function' ? provider : provider.provide;
}
export function constructorTokens(type: Class): readonly Token[] {
  if (!Reflect.getOwnMetadata(injectableKey, type)) {
    throw new Error(`${type.name} must be decorated with @Injectable() to enable constructor DI`);
  }
  const reflected = (Reflect.getOwnMetadata('design:paramtypes', type) as unknown[] | undefined) ?? [];
  const overrides = Reflect.getOwnMetadata(injectKey, type) as Map<number, Token> | undefined;
  const count = Math.max(type.length, reflected.length, ...[...(overrides?.keys() ?? [])].map(i => i + 1), 0);
  return Array.from({ length: count }, (_, index) => {
    const token = overrides?.get(index) ?? reflected[index];
    if (token == null || token === Object || token === Function || token === String || token === Number || token === Boolean ||
        (typeof token !== 'function' && typeof token !== 'symbol' && typeof token !== 'string')) {
      throw new Error(`Cannot infer ${type.name} constructor parameter #${index}. Use a runtime class or @Inject(TOKEN); check emitDecoratorMetadata.`);
    }
    return token as Token;
  });
}
