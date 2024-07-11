import { NodePath } from "@babel/traverse"
import * as t from '@babel/types'
import { fnName } from "../../state/identifier/util"

export default function transformEffect(render: NodePath<t.ClassMethod>) {
  render.node.params = renderParams
  render.traverse({
    JSXElement: {
      exit: path => {
        const children = path.node.children.reduce((res, item) => {
          if (t.isJSXExpressionContainer(item) && !t.isJSXEmptyExpression(item.expression)) {
            res.push(item.expression)
          } else if (t.isArrayExpression(item)) {
            (item as t.ArrayExpression).elements.forEach(item => {
              if (t.isExpression(item)) {
                res.push(item)
              }
            })
          }
          return res
        }, [] as t.Expression[])

        const attrs = path.node.openingElement.attributes
          .reduce((res, item) => {
            if (t.isJSXAttribute(item) && t.isJSXExpressionContainer(item.value) && !t.isJSXEmptyExpression(item.value.expression)) {
              if (t.isJSXNamespacedName(item.name) || (t.isJSXIdentifier(item.name) && !/^data-/.test(item.name.name))) {
                res.push(item.value.expression)
              }
            }
            return res
          }, [] as t.Expression[])

        if (children.length > 0 || attrs.length > 0) {
          path.replaceWith(t.arrayExpression(children.concat(attrs)))
        } else {
          if (path.parentPath.isConditionalExpression()) {
            path.replaceWith(t.nullLiteral())
          } else {
            path.remove()
          }
        }
      }
    }
  })
}



const typeAnnotation = t.tsTypeAnnotation(
  t.tsFunctionType(
    t.tsTypeParameterDeclaration([
      t.tsTypeParameter(null, null, 'T')
    ]),
    [
      addTsTypeAnnotation(
        t.identifier('a'),
        t.tsTypeAnnotation(
          t.tsTypeReference(
            t.identifier('T')
          )
        )
      ),
      addTsTypeAnnotation(
        t.restElement(
          t.identifier('args')
        ),
        t.tsTypeAnnotation(t.tsAnyKeyword())
      )
    ],
    t.tsTypeAnnotation(
      t.tsTypeReference(
        t.identifier('T')
      )
    )
  )
)


const renderParams = [
  addTsTypeAnnotation(t.identifier(fnName.prop), typeAnnotation),
  addTsTypeAnnotation(t.identifier(fnName.event), typeAnnotation)
]

function addTsTypeAnnotation<T>(expression: T, type: t.TSTypeAnnotation): T {
  // @ts-ignore
  expression.typeAnnotation = type
  return expression
}

