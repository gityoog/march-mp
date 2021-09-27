declare namespace Component {
  export namespace config {
    interface map {
      /** 中心经度 */
      longitude: number

      /** 中心纬度 */
      latitude: number

      /** 
       * 缩放级别，取值范围为3-20
       * 默认值16
       */
      scale?: number

      /** 显示带有方向的当前定位点 */
      "show-location"?: boolean

    }
    export namespace map {
      export namespace events {
        export type bindcallouttap = (event: { markerId: number }) => void
      }
      interface marker {
        id?: number
        latitude: number
        longitude: number
        title?: string
        zIndex?: number
        iconPath: string
        rotate?: number
        alpha?: number
        width?: number | string
        height?: number | string
        anchor?: { x: number, y: number }
        callout?: {
          content?: string
          color?: string
          fontSize?: string
          borderRadius?: number
          borderWidth?: number
          borderColor?: string
          bgColor?: string
          padding?: number
          display?: 'BYCLICK' | 'ALWAYS'
          textAlign?: 'left' | 'right' | 'center'
        }
      }
    }
  }
}