export default class ModuleData {
  static map = new Map<string, ModuleData>()
  static Init(path: string) {
    const origin = this.map.get(path)
    if (origin) {
      origin.destory()
    }
    const data = new ModuleData(path)
    this.map.set(path, data)
    return data
  }
  static Has(path: string) {
    return this.map.has(path)
  }
  static Pick(path: string) {
    const data = this.map.get(path)
    if (!data) {
      throw new Error('module data not exist: ' + path)
    }
    return data
  }
  private constructor(public path: string) { }
  json = {} as Record<any, any>
  wxml = ''
  wxss = ''
  wxs = ''
  private children: Record<string, string> = {}
  setJSON(json: Record<any, any>) {
    this.json = json
  }
  setWXML(value: string) {
    this.wxml = value
  }
  addWXSS(value: string) {
    this.wxss += value
  }
  setWXSS(value: string) {
    this.wxss = value
  }
  setWXS(value: string) {
    this.wxs = value
  }
  setStatic(type: 'wxss' | 'wxml' | 'json' | 'wxs', value: string) {
    switch (type) {
      case 'wxss':
        return this.setWXSS(value)
      case 'wxml':
        return this.setWXML(value)
      case 'wxs':
        return this.setWXS(value)
      case 'json':
        return this.setJSON(JSON.parse(value))
    }
  }
  addChild(key: string, path: string) {
    this.children[key] = path
  }
  getChildren() {
    return this.children
  }
  destory() {
    this.children = null!
  }
}