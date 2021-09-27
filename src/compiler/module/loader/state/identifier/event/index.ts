import { iIdentifierItem } from ".."
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { genEventCall } from "../util"

export default class EventIdentifier implements iIdentifierItem {
  private name
  private path: NodePath<t.Node>
  private scope?: t.Expression
  private value: t.Node

  constructor({ path, scope, name }: {
    path: NodePath<t.Node>
    name: string
    scope?: t.Expression
  }) {
    this.name = name
    this.path = path
    this.value = path.node
    this.scope = scope

    this.path.replaceWith(t.stringLiteral(name))
  }
  restore() {
    this.path.replaceWith(
      genEventCall(
        this.value as t.Expression,
        this.scope ? t.arrayExpression([t.stringLiteral(this.name), this.scope]) : t.stringLiteral(this.name)
      )
    )

    this.name = null!
    this.path = null!
    this.scope = null!
    this.value = null!
  }
}