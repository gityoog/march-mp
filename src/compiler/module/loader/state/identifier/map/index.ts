import { iIdentifierItem } from ".."
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { genPropCall, mergeMember } from "../util"
import generate from '@babel/generator'

export default class MapIdentifier implements iIdentifierItem {
  private name
  private path: NodePath<t.CallExpression>
  private calleeObject: t.Node
  private scope: string[]
  private key?: t.Expression
  constructor({ path, scope, name }: {
    path: NodePath<t.CallExpression>
    name: string
    scope: string[]
  }) {
    this.name = name
    this.path = path
    this.scope = scope
    this.key = findMapKey(path)
    const node = mergeMember(t.identifier(name), scope)
    const calleeObject = path.get('callee.object') as NodePath
    this.calleeObject = calleeObject.node
    calleeObject.replaceWith(node)
  }
  restore() {
    const calleeObject = this.path.get('callee.object') as NodePath
    calleeObject.replaceWith(this.calleeObject)

    const arrowFn = this.path.get('arguments')[0]
    if (arrowFn.isArrowFunctionExpression()) {
      const jsxElement = arrowFn.get('body')
      if (jsxElement.isJSXElement()) {
        jsxElement.replaceWith(
          t.sequenceExpression([jsxElement.node, this.key || t.nullLiteral()])
        )
      }
    }
    // _$p(a.map(item => [key|null, ...]), name: string|string[], deepDiff: true)

    this.path.replaceWith(
      genPropCall(
        this.path.node,
        this.scope.length > 0 ? t.arrayExpression([t.stringLiteral(this.name), ...this.scope.map(key => t.identifier(key))]) : t.stringLiteral(this.name)
      )
    )

    this.name = null!
    this.path = null!
    this.calleeObject = null!
    this.scope = null!
    this.key = null!
  }
}


function findMapKey(path: NodePath<t.CallExpression>) {
  const arrowFn = path.get('arguments')[0]
  if (arrowFn.isArrowFunctionExpression()) {
    const jsxElement = arrowFn.get('body')
    if (jsxElement.isJSXElement()) {
      const attr = jsxElement.get('openingElement').get('attributes').find(path => {
        return path.isJSXAttribute() && path.node.name.name === 'key'
      }) as NodePath<t.JSXAttribute> | null
      const value = attr?.get('value')
      if (value?.isJSXExpressionContainer()) {
        const expression = value.node.expression
        if (!t.isJSXEmptyExpression(expression)) {
          value.replaceWith(t.stringLiteral("*this"))
          return expression
        }
      } else if (value?.isStringLiteral()) {
        const param = arrowFn.node.params[0] = (arrowFn.node.params[0] || path.scope.generateUidIdentifier('t')) as t.Identifier
        const key = value.node.value
        if (key === '*this') {
          return param
        } else {
          value.replaceWith(t.stringLiteral("*this"))
          return t.memberExpression(param, t.identifier(key), false)
        }
      }
    }
  }
}