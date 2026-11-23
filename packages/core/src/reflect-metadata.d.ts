/** Compile-time signatures for reflect-metadata. Runtime implementation comes from the package dependency. */
declare namespace Reflect {
  function defineMetadata(metadataKey: unknown, metadataValue: unknown, target: object, propertyKey?: string | symbol): void;
  function getOwnMetadata(metadataKey: unknown, target: object, propertyKey?: string | symbol): unknown;
}
