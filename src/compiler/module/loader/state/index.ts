import { NodePath } from "@babel/traverse"
import DependencyIdentifier from "./identifier"
import MapScope from "./map-scope"
import * as t from '@babel/types'
import PropIdentifier from "./identifier/prop"

export default class State {
  debug = false
  constructor(filename: string) {
    // this.debug = filename === 'D:\\desktop\\smart-webpack\\src\\miniprogram\\project\\康居集团工地长制智慧巡查系统\\pages\\index\\index.tsx'
  }
  json: any = {}
  cssfile: string[] = []
  wxml = ''

  setWXML(value: string) {
    this.wxml = value
  }

  setJSON(value: any) {
    this.json = value
  }

  addCss(file: string) {
    this.cssfile.push(file)
  }

  components: Record<string, {
    path: string
    props: PropIdentifier[]
  }> = {}

  addComponent(name: string, path: string) {
    this.components[name] = this.components[name] || {
      path,
      props: []
    }
  }

  setComponentNative(name: string) {
    this.components[name].props.forEach(prop => {
      prop.setNative()
    })
  }

  private callbacks: Array<() => void> = []
  before(callback: () => void) {
    this.callbacks.push(callback)
  }

  private generator?: () => string
  setGenerator(generator: () => string) {
    this.generator = generator
  }

  generate() {
    this.identifier.restore()
    this.callbacks.forEach(fn => fn())
    return this.generator?.() || ''
  }

  events: string[] = []
  addEvent(name: string) {
    this.events.push(name)
  }

  mapScope = new MapScope()
  identifier = new DependencyIdentifier(this.mapScope)

  enterMap(path: NodePath<t.CallExpression>, scope: string[]) {
    this.mapScope.enter(path, scope)
  }

  exitMap() {
    this.mapScope.exit()
  }

  genMap(path: NodePath<t.CallExpression>) {
    return this.identifier.map(path)
  }

  genProp(path: NodePath<t.Node>, component?: string) {
    path.skip()
    const prop = this.identifier.prop(path)
    if (component) {
      this.components[component].props.push(prop)
    }
  }

  genEvent(path: NodePath<t.Node>) {
    path.skip()
    const { scope, name } = this.identifier.event(path)
    this.events.push(name)
    return { scope, name }
  }

  destroy() {
    this.mapScope.destroy()
    this.identifier.destroy()
    this.json = null!
    this.events = null!
    this.callbacks = null!
    this.generator = null!
    this.components = null!
    this.cssfile = null!
  }
}