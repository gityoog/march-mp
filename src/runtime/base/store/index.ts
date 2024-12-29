import { buildMPData } from "../../utils"
import Diff from './diff'

export default class RuntimeStore {
  private diff = new Diff

  addProp(key: string | string[], value: any, native?: boolean) {
    if (value === undefined) {
      value = null
    } else if (native) {
      if (isObject(value)) {
        value = this.proxyProp(value, key)
      } else if (typeof value === 'function') {
        value = this.proxyFn(value, key)
      }
    }
    this.diff.add(key, value, native)
  }

  start() {
    this.diff.reset()
  }

  end() {
    return this.diff.get()
  }

  private events: Record<string, (...args: any[]) => any> = {}

  addEvent(key: string, fn: any) {
    this.events[key] = fn
  }

  runEvent(key: string, arg: any, event: Event.Base<Record<string, Function>, void>) {
    this.events[key].call(null, arg, event)
  }

  /**框架组件属性代理 */
  private propRecord: Record<string, any> = {}
  private propProxy: Record<string, any> = {}
  private proxyProp(value: any, key: string | string[]) {
    const k = Array.isArray(key) ? key.join('_') : key
    if (this.propRecord[k] !== value) {
      this.propRecord[k] = value
      this.propProxy[k] = buildMPData(value)
    }
    return this.propProxy[k]
  }

  /**事件属性代理 */
  private fnRecord: Record<string, (...args: any[]) => any> = {}
  private fnProxy: Record<string, any> = {}
  private proxyFn(value: (...args: any[]) => any, key: string | string[]) {
    const k = Array.isArray(key) ? key.join('_') : key
    this.fnRecord[k] = value
    if (!this.fnProxy[k]) {
      this.fnProxy[k] = buildMPData((...args: any[]) => this.fnRecord[k].apply(null, args))
    }
    return this.fnProxy[k]
  }

  destroy() {
    this.diff.destroy()
    this.events = null!
    this.fnRecord = null!
    this.fnProxy = null!
    this.propRecord = null!
    this.propRecord = null!
  }
}

function isObject(data: unknown): data is object {
  return typeof data === 'object' && data !== null
}