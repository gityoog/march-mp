import ModuleData from "../../module/data"
import webpack from 'webpack'
import merge from 'lodash.merge'

type sourceType = 'wxml' | 'json' | 'wxss' | 'wxs'
export default class EntryData {
  name: string
  isPage: boolean
  components: Record<string, string>
  module: ModuleData
  path: string

  private sourceCache: {
    [K in sourceType]?: {
      code: string
      source: webpack.sources.CachedSource
    }
  } = {}

  private getSource(type: sourceType, code: string) {
    if (this.sourceCache[type]?.code === code) {
      return this.sourceCache[type]!.source
    } else {
      this.sourceCache[type] = {
        code,
        source: new webpack.sources.CachedSource(new webpack.sources.RawSource(code))
      }
      return this.sourceCache[type]!.source
    }
  }

  constructor({ name, path, page, components }: {
    name: string
    path: string
    page: boolean
    components: Record<string, string>
  }) {
    this.path = path
    this.name = name
    this.isPage = page
    this.components = components
    this.module = ModuleData.Pick(path)
  }

  private getUsingComponents() {
    const components: Record<string, string> = {}
    for (const name in this.components) {
      components[name] = '/' + this.components[name].replace(/\.js$/, '').replace(/\\/g, '/')
    }
    return components
  }

  private getJSON() {
    return JSON.stringify(merge({}, this.module.json, {
      usingComponents: this.getUsingComponents(),
      component: this.isPage ? undefined : true
    }), null, 2)
  }

  getFiles() {
    const files: {
      file: string
      source: webpack.sources.Source
    }[] = []
    const filename = this.name.replace(/\.js$/, '')

    files.push({
      file: filename + '.wxml',
      source: this.getSource('wxml', this.module.wxml)
    })

    files.push({
      file: filename + '.json',
      source: this.getSource('json', this.getJSON())
    })

    if (this.module.wxss) {
      files.push({
        file: filename + '.wxss',
        source: this.getSource('wxss', this.module.wxss)
      })
    }

    if (this.module.wxs) {
      files.push({
        file: filename + '.wxs',
        source: this.getSource('wxs', this.module.wxs)
      })
    }

    return files
  }
}