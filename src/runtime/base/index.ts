
import Reactivity from '../reactivity'
import RuntimeStore from './store'

type pageInstance = WechatMiniprogram.Page.Instance<{}, {}>
type componentInstance = WechatMiniprogram.Component.Instance<{}, {}, {}>
type wxInstance = pageInstance | componentInstance

export default class MPBase {
  static debug = false
  static dataMap = new WeakMap<wxInstance, MPBase>()

  static init<T extends MPBase>(instance: wxInstance, data: T, callback?: () => void): T {
    Object.defineProperty(data, "$this", {
      enumerable: false,
      configurable: false,
      get() {
        return Reactivity.markRaw(instance)
      }
    })
    data.$onReady(() => {
      callback?.()
    })
    const proxyData = Reactivity.reactive(data) as T
    const stop = Reactivity.effect((pause, resume) => {
      if (!data.$store) {
        return
      }
      const timeId = instance.is + Math.random()
      if (this.debug) {
        console.time(timeId)
      }
      data.$store.start()
      proxyData.render(
        // prop 构建
        (value, key, native) => {
          data.$store.addProp(key, Reactivity.toRaw(value), native)
          return value
        },
        // event 构建
        (fn, key) => {
          data.$store.addEvent(Array.isArray(key) ? key.join('.') : key, fn)
          return fn
        }
      )
      pause()
      try {
        const state = data.$store.end()
        if (this.debug) {
          console.timeEnd(timeId)
        }
        if (state) {
          if (this.debug) {
            console.log(instance.is, state)
          }
          instance.setData(state, () => {
            if (!data.$ready) {
              data.$setReady()
            }
          })
        }
      } catch (e) {
        throw e
      } finally {
        resume()
      }
    })
    data.$destoryCallback.push(() => {
      stop()
    })
    return this.bindData(instance, proxyData)
  }
  static bindData<T extends MPBase>(instance: wxInstance, data: T): T {
    this.dataMap.set(instance, data)
    return data
  }
  static getData(instance: wxInstance) {
    return this.dataMap.get(instance)!
  }
  static getRawData(instance: wxInstance) {
    return Reactivity.toRaw(this.getData(instance))
  }
  static destory(instance: wxInstance) {
    this.getData(instance).$destory()
    this.dataMap.delete(instance)
  }
  static initEventsMethods(events: string[]) {
    const methods: Record<string, (...args: any[]) => void> = {}
    const self = this
    events.forEach((name) => {
      methods[name] = function (this: wxInstance, event: Event.Base<Record<string, Function>, void>) {
        const data = self.getData(this)
        const dataset = event.currentTarget.dataset
        const key = dataset[name] !== undefined ? [name, dataset[name]].join('.') : name
        data.$store.runEvent(key, event.detail)
      }
    })
    return methods
  }
  protected $store = new RuntimeStore
  protected $ready: boolean = false
  private $readyCallback: Array<() => void> = []
  protected $onReady(callback: () => void) {
    if (this.$ready) {
      callback()
    } else {
      this.$readyCallback.push(callback)
    }
  }
  private $setReady() {
    this.$ready = true
    this.$readyCallback.forEach(cb => cb())
    this.$readyCallback = []
  }

  protected $destoryCallback: Array<() => void> = []
  protected $destory() {
    this.$destoryCallback.forEach(fn => fn())
    this.$destoryCallback = []
    this.$readyCallback = []
    this.$store.destroy()
    this.$store = null!
  }

  /**编译后覆盖 render函数 */
  protected render(genProp: <T>(value: T, key: Array<string> | string, native?: boolean) => T, genEvent: <T>(value: T, key: Array<string> | string) => T): any { }
}