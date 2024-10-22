import { extname, isAbsolute, join, normalize } from 'pathe'

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

export function lastFolder(path: string): string {
  const normalized = normalize(
    extname(path) === ''
      ? join(path, '/')
      : path,
  )

  return normalized.split('/').at(-2)!
}

export function mapReverse<K, V>(map: Map<K, V>): Map<V, K[]> {
  const reverseMap = new Map<V, K[]>()
  map.forEach((value, key) => {
    if (!reverseMap.has(value)) {
      reverseMap.set(value, [])
    }
    reverseMap.get(value)!.push(key)
  })
  return reverseMap
}

export function lowercaseDriver(path: string): string {
  return isAbsolute(path) ? normalize(path).replace(/^([a-z]):\//i, (_, $1: string) => `${$1.toLowerCase()}:/`) : path
}
