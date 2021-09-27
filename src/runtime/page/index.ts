import MPBase from "../base"

const readySymbol = Symbol()
export default class MPPage extends MPBase {
  protected readonly $this!: WechatMiniprogram.Page.Instance<{}, {}>

  protected onLoad?(data: Record<string, string | undefined>): void
  protected onShow?(): void
  protected onHide?(): void
  protected onUnload?(): void
  protected onReady?(): void

  static create({ events }: {
    events: string[]
  }) {
    const methods = this.initEventsMethods(events)
    const Self = this
    return Page({
      onLoad(args: any) {
        const data = Self.init(this, new Self(), () => {
          data.onLoad?.(args)
          data.onShow?.()
          Reflect.set(this, readySymbol, true)
        })
      },
      onReady() {
        const data = Self.getData(this) as MPPage
        data.$onReady(() => {
          data.onReady?.()
        })
      },
      onShow() {
        if (Reflect.get(this, readySymbol)) {
          const data = Self.getData(this) as MPPage
          data.onShow?.()
        }
      },
      onHide() {
        const data = Self.getData(this) as MPPage
        data.onHide?.()
      },
      onUnload() {
        const data = Self.getData(this) as MPPage
        data.onUnload?.()
        Self.destory(this)
      },
      ...methods
    })
  }
}