export function clone(value: unknown) {
  if (value instanceof Map) {
    return new Map(value)
  }

  if (Array.isArray(value)) {
    return value.slice(0)
  }

  if (typeof value === 'object' && value) {
    return {
      ...value,
    }
  }

  return value
}
