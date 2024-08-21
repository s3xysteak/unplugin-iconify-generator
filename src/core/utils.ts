export function toArray<T>(array?: T | T[]): T[] {
  array = array ?? []
  return Array.isArray(array) ? array : [array]
}

export function objectMap<K extends string, V, NK extends PropertyKey = K, NV = V>(obj: Record<K, V>, fn: (key: K, value: V) => [NK, NV] | undefined): Record<NK, NV> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => fn(k as K, v as V))
      .filter(notNullish),
  ) as Record<NK, NV>
}

export function notNullish<T>(v: T | null | undefined): v is NonNullable<T> {
  return v != null
}
