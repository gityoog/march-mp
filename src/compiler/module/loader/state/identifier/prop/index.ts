import { iIdentifierItem } from ".."
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { genPropCall, mergeMember } from "../util"

export default class PropIdentifier implements iIdentifierItem {
  private name
  private path: NodePath<t.Node>
  private scope: string[]
  private value: t.Node
  private native = false
  constructor({ path, scope, name }: {
    path: NodePath<t.Node>
    name: string
    scope: string[]
  }) {
    this.name = name
    this.path = path
    this.scope = scope
    this.value = path.node

    this.path.replaceWith(
      mergeMember(t.identifier(name), scope)
    )
  }

  setNative() {
    this.native = true
  }

  restore() {
    this.path.replaceWith(
      genPropCall(
        this.value as t.Expression,
        this.scope.length > 0 ? t.arrayExpression([t.stringLiteral(this.name), ...this.scope.map(key => t.identifier(key))]) : t.stringLiteral(this.name),
        this.native
      )
    )

    this.name = null!
    this.path = null!
    this.scope = null!
    this.value = null!
  }
}