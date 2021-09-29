import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

// todo index重复问题
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
    if (!params[0]) {
      params.push(path.scope.generateUidIdentifier('t'))
    }
    if (!params[1]) {
      params.push(path.scope.generateUidIdentifier('i'))
    }
    if (!t.isIdentifier(params[0]) || !t.isIdentifier(params[1])) {
      throw path.buildCodeFrameError('Map params only support Identifier')
    }
    this.push(params[0].name, params[1].name, parent)
  }
  exit() {
    this.data.pop()
    this.update()
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
          const name = item.node.name
          if (t.isReferenced(item.node, item.parent)) {
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

  }
}