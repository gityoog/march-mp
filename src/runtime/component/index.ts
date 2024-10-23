import MPBase from "../base"
import Reactivity from "../reactivity"
import { isMPDataReady, originMPData } from "../utils"

type componentInstance = WechatMiniprogram.Component.Instance<{}, {}, {}>
export default class MPComponent<
  /**组件需要传入参数 */
  T extends object = {},
  /**有默认值的组件参数名称, 默认值请申明在static propsDefault中*/
  P extends keyof T = never
> extends MPBase {

  /**组件数据监控 { 字段名称: 运行的组件方法名称 } */
  static observers: Record<string, string> = {};

  /**组件参数默认值 */
  static propsDefault: Record<string, any> = {};

  /**组件参数 编译后覆盖 */
  static properties: Record<string, any> = {};

  static $options: any = {};

  static create({ properties, events }: {
    properties: Record<string, any>
    events: string[]
  }) {
    const methods = this.initEventsMethods(events)
    this.properties = properties
    // 将默认值赋值给properties
    for (const key in this.properties) {
      if (this.propsDefault[key] !== undefined) {
        this.properties[key] = {
          type: this.properties[key],
          value: this.propsDefault[key],
        }
      }
    }

    const observers: Record<string, (this: componentInstance, ...args: any) => void> = {}
    // 映射定义的监控变量和触发函数
    for (const key in this.properties) {
      const obMethodName = this.observers[key]
      observers[key] = function (newData) {
        const data = Self.getData(this) as MPComponent<any>
        const oldValue = data.$props[key]
        if (!isMPDataReady(newData)) {
          console.log('MPData is not Ready', newData)
          return
        }
        const newValue = originMPData(newData, this.is + '->observers->' + key)
        if (oldValue === newValue) {
          return
        }
        Reactivity.set(data.$props, key, newValue)
        // data.$props[key] = newValue
        if (obMethodName) {
          // 运行监控数据映射的函数
          const method = (<any>data)[obMethodName]
          if (method) {
            method.apply(data, [newValue, oldValue])
          } else {
            console.error(`observer method ${obMethodName} is not exist`)
          }
        }
      }
    }

    const Self = this
    return Component({
      options: {
        ...this.$options
      },
      observers,
      properties: this.properties,
      lifetimes: {
        created() {
          const data = new Self()
          Self.bindData(this, data)
          data.created?.()
        },
        attached() {
          const data = Self.init(this, Self.getData(this) as MPComponent, () => {
            data.attached?.()
          })
        },
        detached() {
          const data = Self.getData(this) as MPComponent
          data.detached?.()
          Self.destory(this)
        }
      },
      methods: methods
    })
  }
  protected created?(): void
  protected detached?(): void
  protected attached?(): void
  protected readonly $this!: WechatMiniprogram.Component.Instance<{}, {}, {}>
  readonly $props!: T & ([P] extends [never] ? {} : { [key in P]-?: T[P] })

  constructor(args: Readonly<T> = {} as T) {
    super()

    Object.defineProperty(this, '$props', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: {}
    })
  }

}