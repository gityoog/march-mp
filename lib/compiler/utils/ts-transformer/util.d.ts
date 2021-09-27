import ts from 'typescript';
export declare function traverse(node: ts.Node, visitor: {
    enter?: (node: ts.Node) => ts.Node | void;
    exit?: (node: ts.Node) => void;
}, context: ts.TransformationContext): ts.Node;
export declare function isPropertyAccessExpression(node: ts.Node): node is ts.PropertyAccessExpression;
export declare function isBinaryExpression(node: ts.Node): node is ts.BinaryExpression;
export declare function isCallExpression(node: ts.Node): node is ts.CallExpression;
export declare function isImportDeclaration(node: ts.Node): node is ts.ImportDeclaration;
export declare function isStringLiteral(node: ts.Node): node is ts.StringLiteral;
export declare function addStatement(sourceFile: ts.SourceFile, statement: ts.Statement): ts.SourceFile;
export declare function toCode(node: ts.Node): string;
