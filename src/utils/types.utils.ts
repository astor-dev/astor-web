export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export function isEmptyArray<T>(value: T[]): boolean {
  return value.length === 0;
}

export function isEmptyObject(value: object): boolean {
  return Object.keys(value).length === 0;
}
