import ts, { EmitHint } from 'typescript'

export function traverse(node: ts.Node, visitor: {
  enter?: (node: ts.Node) => ts.Node | void
  exit?: (node: ts.Node) => void
}, context: ts.TransformationContext): ts.Node {
  let result = visitor.enter?.(node)
  if (!result) {
    result = ts.visitEachChild(node, node => traverse(node, visitor, context), context)
  }
  visitor.exit?.(result)
  return result
}

export function isPropertyAccessExpression(node: ts.Node): node is ts.PropertyAccessExpression {
  return node.kind === ts.SyntaxKind.PropertyAccessExpression
}

export function isBinaryExpression(node: ts.Node): node is ts.BinaryExpression {
  return node.kind === ts.SyntaxKind.BinaryExpression
}

export function isCallExpression(node: ts.Node): node is ts.CallExpression {
  return node.kind === ts.SyntaxKind.CallExpression
}

export function isImportDeclaration(node: ts.Node): node is ts.ImportDeclaration {
  return node.kind === ts.SyntaxKind.ImportDeclaration
}

export function isStringLiteral(node: ts.Node): node is ts.StringLiteral {
  return node.kind === ts.SyntaxKind.StringLiteral
}

export function addStatement(sourceFile: ts.SourceFile, statement: ts.Statement) {
  return ts.factory.updateSourceFile(
    sourceFile,
    [
      statement,
      ...sourceFile.statements
    ],
    sourceFile.isDeclarationFile,
    sourceFile.referencedFiles,
    sourceFile.typeReferenceDirectives,
    sourceFile.hasNoDefaultLib,
    sourceFile.libReferenceDirectives
  )
}

export function toCode(node: ts.Node) {
  const printer = ts.createPrinter()
  return printer.printNode(EmitHint.Expression, node, ts.createSourceFile('a.ts', '', ts.ScriptTarget.Latest))
}