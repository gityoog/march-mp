import { NodePath } from "@babel/traverse"
import * as t from '@babel/types'
import generate from '@babel/generator'

export default function getJSON(path: NodePath<t.ClassDeclaration>) {
  const json = path.get('body.body').find(item => {
    if (item.isClassProperty()) {
      const key = item.get('key')
      if (key.isIdentifier()) {
        return key.node.name === '$json'
      }
    }
    return false
  }) as NodePath<t.ClassProperty> | undefined

  if (json) {
    const node = json.get('value').node
    if (node) {
      return eval(`(${generate(node, { comments: false }).code})`)
    }
    json.remove()
  }
}