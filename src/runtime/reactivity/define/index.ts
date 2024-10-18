import Reactivity from ".."
import { reactive, watchEffect, pushTarget, popTarget, toRaw, markRaw } from 'vue-reactivity'

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
  }
}

export default DefineReactivity