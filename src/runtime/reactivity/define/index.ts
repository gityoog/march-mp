import Reactivity from ".."
import { reactive, watchEffect, pushTarget, popTarget, toRaw, markRaw, set } from 'vue-reactivity'

const DefineReactivity: Reactivity = {
  reactive<T extends object>(data: T): T {
    return reactive(data) as T
  },
  effect(callback: (pause: () => void, resume: () => void) => void): () => void {
    return watchEffect(() => {
      callback(() => pushTarget(), () => popTarget())
    })
  },
  toRaw<T>(data: T): T {
    return toRaw(data)
  },
  markRaw<T extends object>(data: T): T {
    return markRaw(data) as T
  },
  set<T extends object, K extends keyof T>(data: T, key: K, value: T[K]): void {
    set(data, key as string, value)
  }
}

export default DefineReactivity