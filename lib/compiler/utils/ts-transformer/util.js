"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCode = exports.addStatement = exports.isStringLiteral = exports.isImportDeclaration = exports.isCallExpression = exports.isBinaryExpression = exports.isPropertyAccessExpression = exports.traverse = void 0;
var typescript_1 = require("typescript");
function traverse(node, visitor, context) {
    var _a, _b;
    var result = (_a = visitor.enter) === null || _a === void 0 ? void 0 : _a.call(visitor, node);
    if (!result) {
        result = typescript_1.default.visitEachChild(node, function (node) { return traverse(node, visitor, context); }, context);
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
    return typescript_1.default.factory.updateSourceFile(sourceFile, __spreadArray([
        statement
    ], __read(sourceFile.statements), false), sourceFile.isDeclarationFile, sourceFile.referencedFiles, sourceFile.typeReferenceDirectives, sourceFile.hasNoDefaultLib, sourceFile.libReferenceDirectives);
}
exports.addStatement = addStatement;
function toCode(node) {
    var printer = typescript_1.default.createPrinter();
    return printer.printNode(typescript_1.EmitHint.Expression, node, typescript_1.default.createSourceFile('a.ts', '', typescript_1.default.ScriptTarget.Latest));
}
exports.toCode = toCode;
