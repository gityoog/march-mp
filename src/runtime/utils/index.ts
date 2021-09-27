const originKey = '__origin__fn'

export function buildMPData<T>(object: T) {
  const result = {
    [originKey]: () => object
  }
  return result
}

export function initMPData<T>(object: T) {
  if (isObject(object)) {
    const fn = Reflect.get(object, originKey)
    if (!fn) {
      Reflect.set(object, originKey, () => object)
      return true
    }
  }
  return false
}

export function isMPDataReady<T>(object: T) {
  if (isObject(object)) {
    const originFn = Reflect.get(object, originKey)
    if (originFn) {
      return true
    } else {
      return false
    }
  }
  return true
}

export function originMPData<T>(object: T, info?: string, other?: any) {
  if (isObject(object)) {
    const originFn = Reflect.get(object, originKey) as () => T
    if (originFn) {
      return originFn()
    } else {
      console.warn('----unset origin data----', info, object, other)
    }
  }
  return object
}

function isObject(data: unknown): data is object {
  return typeof data === 'object' && data !== null && !Array.isArray(data)
}