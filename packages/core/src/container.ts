import { Class, ModuleMetadata, Provider, Token, moduleMetadata, providerToken, tokenName, constructorTokens } from './di';

interface ModuleRef {
  readonly type: Class;
  readonly meta: ModuleMetadata;
  readonly providers: Map<Token, Provider>;
  readonly imports: ModuleRef[];
  readonly exports: ReadonlySet<Token>;
}

/** Module-scoped singleton DI, strict imports/exports, constructor cycle detection. */
export class Container {
  private readonly modules = new Map<Class, ModuleRef>();
  private readonly instances = new Map<ModuleRef, Map<Token, unknown>>();
  private readonly constructing: string[] = [];
  private readonly initializationOrder: unknown[] = [];
  private readonly globals = new Map<Token, unknown>();
  private active = false;
  private root: ModuleRef;

  constructor(rootType: Class, externalProviders: readonly Provider[] = []) {
    this.root = this.compile(rootType, new Set());
    for (const provider of externalProviders) {
      if (typeof provider === 'function' || !('useValue' in provider)) {
        throw new Error('External bootstrap providers currently support useValue only');
      }
      const token = providerToken(provider);
      if (this.globals.has(token) || this.root.providers.has(token)) throw new Error(`Duplicate external provider: ${tokenName(token)}`);
      this.globals.set(token, provider.useValue);
    }
    for (const mod of this.modules.values()) {
      for (const token of mod.exports) {
        if (!mod.providers.has(token) && !mod.imports.some(i => i.exports.has(token))) {
          throw new Error(`${mod.type.name} exports unavailable provider ${tokenName(token)}`);
        }
      }
    }
  }

  private compile(type: Class, pending: Set<Class>): ModuleRef {
    const cached = this.modules.get(type);
    if (cached) return cached;
    if (pending.has(type)) throw new Error(`Circular module import at ${type.name}`);
    const meta = moduleMetadata(type);
    if (!meta) throw new Error(`Missing @SceneModule on ${type.name}`);
    pending.add(type);
    const imports = (meta.imports ?? []).map(i => this.compile(i, pending));
    pending.delete(type);
    const providers = new Map<Token, Provider>();
    for (const provider of meta.providers ?? []) {
      const token = providerToken(provider);
      if (providers.has(token)) throw new Error(`Duplicate provider ${tokenName(token)} in ${type.name}`);
      providers.set(token, provider);
    }
    const mod: ModuleRef = {type, meta, imports, providers, exports: new Set(meta.exports ?? [])};
    this.modules.set(type, mod);
    return mod;
  }

  resolve<T>(token: Token<T>): T { return this.resolveFrom(this.root, token) as T; }

  private resolveFrom(mod: ModuleRef, token: Token): unknown {
    if (!mod.providers.has(token)) {
      // Explicit host-supplied bootstrap values are visible to every module.
      if (this.globals.has(token)) return this.globals.get(token);
      const candidates = mod.imports.filter(i => i.exports.has(token));
      if (candidates.length > 1) throw new Error(`Ambiguous import ${tokenName(token)} in ${mod.type.name}`);
      if (candidates.length === 1) return this.resolveFrom(candidates[0], token);
      throw new Error(`Provider ${tokenName(token)} not visible in module ${mod.type.name}`);
    }
    let instances = this.instances.get(mod);
    if (!instances) { instances = new Map(); this.instances.set(mod, instances); }
    if (instances.has(token)) return instances.get(token);
    const marker = `${mod.type.name}:${tokenName(token)}`;
    if (this.constructing.includes(marker)) throw new Error(`Circular provider dependency: ${[...this.constructing, marker].join(' -> ')}`);
    this.constructing.push(marker);
    try {
      const provider = mod.providers.get(token)!;
      let result: unknown;
      if (typeof provider === 'function') {
        result = new provider(...constructorTokens(provider).map(t => this.resolveFrom(mod, t)));
      } else if ('useValue' in provider) {
        result = provider.useValue;
      } else if ('useFactory' in provider) {
        result = provider.useFactory(...(provider.inject ?? []).map(t => this.resolveFrom(mod, t)));
      } else {
        result = new provider.useClass(...constructorTokens(provider.useClass).map(t => this.resolveFrom(mod, t)));
      }
      if (result instanceof Promise) throw new Error(`Async factory ${tokenName(token)} is not supported; use onSceneInit for async initialization`);
      instances.set(token, result);
      if (result !== null && typeof result === 'object' && !this.initializationOrder.includes(result)) {
        this.initializationOrder.push(result);
      }
      return result;
    } finally { this.constructing.pop(); }
  }

  async initialize(): Promise<void> {
    if (this.active) return;
    // Instantiating providers can instantiate dependencies in other modules first.
    for (const mod of this.modules.values()) for (const token of mod.providers.keys()) this.resolveFrom(mod, token);
    this.active = true;
    const initialized: unknown[] = [];
    try {
      for (const instance of this.initializationOrder) {
        await (instance as {onSceneInit?: () => void | Promise<void>}).onSceneInit?.();
        initialized.push(instance);
      }
    } catch (err) {
      for (const instance of initialized.reverse()) {
        try { await (instance as {onSceneDestroy?: () => void | Promise<void>}).onSceneDestroy?.(); } catch { /* preserve original error */ }
      }
      this.active = false;
      throw err;
    }
  }

  async destroy(): Promise<void> {
    if (!this.active) return;
    this.active = false;
    const errors: unknown[] = [];
    for (const instance of [...this.initializationOrder].reverse()) {
      try { await (instance as {onSceneDestroy?: () => void | Promise<void>}).onSceneDestroy?.(); }
      catch (error) { errors.push(error); }
    }
    if (errors.length) throw new AggregateError(errors, 'Scene teardown failed');
  }
}
