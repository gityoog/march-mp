"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCode = exports.addStatement = exports.isStringLiteral = exports.isImportDeclaration = exports.isCallExpression = exports.isBinaryExpression = exports.isPropertyAccessExpression = exports.traverse = void 0;
const typescript_1 = __importStar(require("typescript"));
function traverse(node, visitor, context) {
    var _a, _b;
    let result = (_a = visitor.enter) === null || _a === void 0 ? void 0 : _a.call(visitor, node);
    if (!result) {
        result = typescript_1.default.visitEachChild(node, node => traverse(node, visitor, context), context);
    }
    (_b = visitor.exit) === null || _b === void 0 ? void 0 : _b.call(visitor, result);
    return result;
}
exports.traverse = traverse;
function isPropertyAccessExpression(node) {
    return node.kind === typescript_1.default.SyntaxKind.PropertyAccessExpression;
}
exports.isPropertyAccessExpression = isPropertyAccessExpression;
function isBinaryExpression(node) {
    return node.kind === typescript_1.default.SyntaxKind.BinaryExpression;
}
exports.isBinaryExpression = isBinaryExpression;
function isCallExpression(node) {
    return node.kind === typescript_1.default.SyntaxKind.CallExpression;
}
exports.isCallExpression = isCallExpression;
function isImportDeclaration(node) {
    return node.kind === typescript_1.default.SyntaxKind.ImportDeclaration;
}
exports.isImportDeclaration = isImportDeclaration;
function isStringLiteral(node) {
    return node.kind === typescript_1.default.SyntaxKind.StringLiteral;
}
exports.isStringLiteral = isStringLiteral;
function addStatement(sourceFile, statement) {
    return typescript_1.default.factory.updateSourceFile(sourceFile, [
        statement,
        ...sourceFile.statements
    ], sourceFile.isDeclarationFile, sourceFile.referencedFiles, sourceFile.typeReferenceDirectives, sourceFile.hasNoDefaultLib, sourceFile.libReferenceDirectives);
}
exports.addStatement = addStatement;
function toCode(node) {
    const printer = typescript_1.default.createPrinter();
    return printer.printNode(typescript_1.EmitHint.Expression, node, typescript_1.default.createSourceFile('a.ts', '', typescript_1.default.ScriptTarget.Latest));
}
exports.toCode = toCode;
