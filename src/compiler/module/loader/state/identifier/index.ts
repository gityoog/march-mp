import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import MapScope from '../map-scope'
import MapIdentifier from './map'
import PropIdentifier from './prop'
import EventIdentifier from './event'
import { genExpression } from './util'

export interface iIdentifierItem {
  restore(): void
}

export default class DependencyIdentifier {
  private prefix = {
    prop: 'p',
    event: 'e',
    scope: 's'
  }
  private _id = {
    prop: 0,
    event: 0,
    scope: 0
  }
  private data: iIdentifierItem[] = []

  constructor(private scope: MapScope) { }

  private genName(type: 'prop' | 'event' | 'scope') {
    return this.prefix[type] + (this._id[type]++)
  }

  map(path: NodePath<t.CallExpression>) {
    const name = this.genName('prop')
    const calleeObject = path.get('callee.object') as NodePath
    const scope = this.scope.getScope(calleeObject)
    this.data.push(
      new MapIdentifier({
        name, path, scope
      })
    )
    return scope
  }

  prop(path: NodePath<t.Node>) {
    const name = this.genName('prop')
    const scope = this.scope.getScope(path)
    const prop = new PropIdentifier({
      name, path, scope
    })
    this.data.push(prop)
    return prop
  }

  event(path: NodePath<t.Node>) {
    const name = this.genName('event')
    const scope = genExpression(this.scope.getScope(path))
    this.data.push(
      new EventIdentifier({
        name, path, scope
      })
    )
    return {
      scope, name
    }
  }

  restore() {
    this.data.forEach(item => {
      item.restore()
    })
    this.data = []
  }

  destroy() {

  }
}