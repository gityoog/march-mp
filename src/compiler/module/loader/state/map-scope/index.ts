import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

export default class MapScope {
  private data: [string, string, string[]][] = []
  private dict: Record<string, string[]> = {}
  private push(item: string, index: string, parent: string[]) {
    this.data.push([item, index, parent])
    this.update()
  }
  enter(path: NodePath<t.CallExpression>, parent: string[]) {
    const arrowFn = path.get('arguments')[0]
    if (!arrowFn.isArrowFunctionExpression()) {
      throw path.buildCodeFrameError('Map only support ArrowFunctionExpression')
    }
    const params = arrowFn.node.params
    let item = params[0]
    let index = params[1]
    if ((item && !t.isIdentifier(item)) || (index && !t.isIdentifier(index))) {
      throw path.buildCodeFrameError('Map params only support Identifier')
    }
    if (!item) {
      item = path.scope.generateUidIdentifier('t')
      params.push(item)
    }
    if (!index) {
      index = path.scope.generateUidIdentifier('i')
      params.push(index)
    } else {
      const name = index.name
      // 重复的index重命名
      if (this.has(name)) {
        arrowFn.scope.rename(name)
      }
    }
    this.push(item.name, index.name, parent)
  }
  exit() {
    this.data.pop()
    this.update()
  }
  private has(id: string) {
    return this.getIndex(id) !== undefined
  }
  private getIndex(id: string): string[] | undefined {
    return this.dict[id]
  }
  private update() {
    const dict: Record<string, string[]> = {}
    this.data.forEach(([item, index, parent]) => {
      dict[item] = dict[index] = [index].concat(parent)
    })
    this.dict = dict
  }

  getScope(path: NodePath) {
    const result: string[] = []
    if (this.data.length > 0) {
      const indexs = new Set<string>()
      path.traverse({
        Identifier: item => {
          if (t.isReferenced(item.node, item.parent)) {
            const name = item.node.name
            if (item.scope.getBinding(name) === path.parentPath!.scope.getBinding(name)) {
              this.getIndex(name)?.forEach(index => {
                indexs.add(index)
              })
            }
          }
        }
      })
      // traverse 不会遍历当前元素
      if (path.isIdentifier()) {
        this.getIndex(path.node.name)?.forEach(index => {
          indexs.add(index)
        })
      }
      result.push(...indexs)
      indexs.clear()
    }
    return result
  }
  destroy() {
    this.data = null!
    this.dict = null!
  }
}