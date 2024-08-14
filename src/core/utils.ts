export function toArray<T>(array?: T | T[]): T[] {
  array = array ?? []
  return Array.isArray(array) ? array : [array]
}
