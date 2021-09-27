import * as t from '@babel/types'

export function mergeMember(identifier: t.Identifier, indexs: string[]): t.Identifier | t.MemberExpression {
  let node: t.Identifier | t.MemberExpression = identifier
  indexs.forEach(index => {
    node = t.memberExpression(node, t.identifier(index), true)
  })
  return node
}

export function genExpression(indexs: string[]) {
  let property: t.Expression | undefined = undefined
  for (const index of indexs) {
    if (!property) {
      property = t.identifier(index)
    } else {
      property = t.binaryExpression(
        '+',
        t.binaryExpression(
          '+',
          property,
          t.stringLiteral('_')
        ),
        t.identifier(index)
      )
    }
  }
  return property
}

export const fnName = {
  prop: '_$p',
  event: '_$e'
}

export function genPropCall(value: t.Expression, name: t.StringLiteral | t.ArrayExpression, native?: boolean) {
  return t.callExpression(t.identifier(fnName.prop), [
    value,
    name
  ].concat(native ? t.booleanLiteral(true) : []))
}

export function genEventCall(value: t.Expression, name: t.StringLiteral | t.ArrayExpression) {
  return t.callExpression(t.identifier(fnName.event), [
    value,
    name
  ])
}