import ts, { EmitHint } from 'typescript'
import { toCode } from '../util'

export default class FixThisState {
  private _identifier?: ts.Identifier
  get identifier() {
    if (this._identifier) {
      return this._identifier
    } else {
      return this._identifier = ts.factory.createUniqueName('reactive')
    }
  }
  isChanged() {
    return this._identifier !== undefined
  }

  private arrowCount = 0

  isInArrow() {
    return this.arrowCount > 0
  }
  enterArrow() {
    this.arrowCount++
  }
  leaveArrow() {
    this.arrowCount--
  }

  private data: {
    node: ts.Node
    status: 0 | 1
  }[] = []

  add(node: ts.Node) {
    this.data.unshift({
      node, status: 0
    })
  }

  private getLast(): { node: ts.Node, status: 0 | 1 } | undefined {
    return this.data[0]
  }

  private removeLast() {
    this.data.splice(0, 1)
  }

  isActived() {
    return this.getLast()?.status === 1
  }

  active(node: ts.Node) {
    const item = this.getLast()
    if (item?.node === node) {
      // console.log('actived', toCode(node))
      item.status = 1
    }
  }

  leave(node: ts.Node) {
    if (this.getLast()?.node === node) {
      this.removeLast()
    }
  }

  log() {
    console.log('------------')
    this.data.forEach(item => {
      console.log(toCode(item.node))
    })
    console.log('------------')
  }
}