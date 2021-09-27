import { NodePath } from "@babel/traverse"
import * as t from '@babel/types'

export default function getProperties(path: NodePath<t.ClassDeclaration>) {
  const declaration = path.node
  const result: t.ObjectProperty[] = []
  if (t.isTSTypeParameterInstantiation(declaration.superTypeParameters)) {
    const objectType = declaration.superTypeParameters.params[0]
    if (t.isTSTypeLiteral(objectType)) {
      objectType.members.forEach(property => {
        if (t.isTSMethodSignature(property)) {
          if (t.isIdentifier(property.key)) {
            result.push(
              t.objectProperty(
                property.key,
                t.identifier('null')
              )
            )
          }
        } else if (t.isTSPropertySignature(property) && property.typeAnnotation) {
          if (t.isIdentifier(property.key)) {
            const type = property.typeAnnotation.typeAnnotation
            result.push(
              t.objectProperty(
                property.key,
                t.isTSStringKeyword(type) ?
                  t.identifier('String') :
                  t.isTSNumberKeyword(type) ?
                    t.identifier('Number') :
                    t.isTSBooleanKeyword(type) ?
                      t.identifier('Boolean') :
                      t.identifier('null')
              )
            )
          }
        } else {
          // `unknown component params type ${property.type}`
        }
      })
    }
  }
  return result
}