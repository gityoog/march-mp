/// <reference path="./types/index.d.ts" />
/// <reference path="./component.config.d.ts" />
/// <reference path="./event.d.ts" />

type PartialAll<T> = {
  [P in keyof T]?: PartialAll<T[P]>
}

declare namespace WechatMiniprogram {
  namespace Component {
    interface InstanceMethods<D extends DataOption> {
      setData<T>(data: T & Partial<D> & IAnyObject, callback?: () => void): void
    }
  }
  interface Wx {
    requestWithCookie: WechatMiniprogram.Wx['request']
    uploadFileWithCookie: WechatMiniprogram.Wx['uploadFile']
    test: any
  }
}