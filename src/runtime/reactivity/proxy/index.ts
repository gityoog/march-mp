import Reactivity from ".."
import { reactive, effect, stop, pauseTracking, enableTracking, toRaw, markRaw } from '../../@vue_reactivity'

const ProxyReactivity: Reactivity = {
  reactive<T extends object>(data: T): T {
    return reactive(data) as T
  },
  effect(callback: (pause: () => void, resume: () => void) => void): () => void {
    const result = effect(() => {
      callback(() => pauseTracking(), () => enableTracking())
    })
    return () => {
      stop(result)
    }
  },
  toRaw<T>(data: T): T {
    return toRaw(data)
  },
  markRaw<T extends object>(data: T): T {
    return markRaw(data) as T
  }
}

export default ProxyReactivity