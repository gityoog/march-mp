import DefineReactivity from "./define"
import ProxyReactivity from "./proxy"

interface Reactivity {
  reactive<T extends object>(data: T): T
  effect(callback: (pause: () => void, resume: () => void) => void): () => void
  toRaw<T>(data: T): T
  markRaw<T extends object>(data: T): T
  set<T extends object, K extends keyof T>(data: T, key: K, value: T[K]): void
}

const proxy = ProxyReactivity
const define = DefineReactivity

let actived: Reactivity = ProxyReactivity

const Reactivity = {
  use(type: 'proxy' | 'define') {
    actived = type === 'proxy' ? proxy : define
  },
  reactive<T extends object>(data: T): T {
    return actived.reactive(data)
  },
  effect(callback: (pause: () => void, resume: () => void) => void): () => void {
    return actived.effect(callback)
  },
  toRaw<T>(data: T): T {
    return actived.toRaw(data)
  },
  markRaw<T extends object>(data: T): T {
    return actived.markRaw(data)
  },
  set<T extends object, K extends keyof T>(data: T, key: K, value: T[K]): void {
    actived.set(data, key, value)
  }
}

export default Reactivity