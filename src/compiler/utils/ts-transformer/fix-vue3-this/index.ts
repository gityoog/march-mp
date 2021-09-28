import ts from 'typescript'
import FixThisState from './state'
import { traverse, isBinaryExpression, isCallExpression, isPropertyAccessExpression, addStatement } from '../util'

const fixVue3This: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return sourceFile => {
    if (sourceFile.languageVariant !== ts.LanguageVariant.Standard || sourceFile.isDeclarationFile) {
      return sourceFile
    }
    const state = new FixThisState()
    sourceFile = ts.visitEachChild(sourceFile, node => {
      if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        return ts.visitEachChild(node, node => {
          if (node.kind === ts.SyntaxKind.Constructor || node.kind === ts.SyntaxKind.PropertyDeclaration) {
            return traverse(node, {
              enter: node => {
                if (node.kind === ts.SyntaxKind.ArrowFunction) {
                  state.enterArrow()
                } else if (node.kind === ts.SyntaxKind.FunctionExpression) {
                  return node
                } else if (state.isInArrow()) {
                  state.active(node)
                  if (isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.FirstAssignment) {
                    state.add(node.left)
                  }
                  else if (isCallExpression(node)) {
                    state.add(node.expression)
                  }
                  else if (state.isActived() && isPropertyAccessExpression(node) && node.expression.kind === ts.SyntaxKind.ThisKeyword) {
                    return context.factory.updatePropertyAccessExpression(node, context.factory.createCallExpression(state.identifier, [], [node.expression as ts.ThisExpression]), node.name)
                  }
                }
              },
              exit: node => {
                if (node.kind === ts.SyntaxKind.ArrowFunction) {
                  state.leaveArrow()
                } else {
                  state.leave(node)
                }
              }
            }, context)
          }
          return node
        }, context)
      }
      return node
    }, context)
    if (state.isChanged()) {
      return addStatement(sourceFile,
        ts.factory.createVariableStatement(undefined,
          ts.factory.createVariableDeclarationList([
            ts.factory.createVariableDeclaration(
              state.identifier,
              undefined,
              undefined,
              ts.factory.createAsExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createCallExpression(
                    ts.factory.createIdentifier('require'),
                    undefined,
                    [ts.factory.createStringLiteral('march-mp')]
                  ),
                  ts.factory.createIdentifier('reactive')
                ),
                ts.factory.createFunctionTypeNode([
                  ts.factory.createTypeParameterDeclaration('T')
                ], [
                  ts.factory.createParameterDeclaration(undefined, undefined, undefined, 'data', undefined, ts.factory.createTypeReferenceNode("T"))
                ], ts.factory.createTypeReferenceNode("T"))
              )
            )
          ], ts.NodeFlags.Const)
        )
      )
    }
    return sourceFile
  }
}

export default fixVue3This