"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
var state_1 = require("./state");
var util_1 = require("../util");
var fixVue3This = function (context) {
    return function (sourceFile) {
        if (sourceFile.languageVariant !== typescript_1.default.LanguageVariant.Standard || sourceFile.isDeclarationFile) {
            return sourceFile;
        }
        var state = new state_1.default();
        sourceFile = typescript_1.default.visitEachChild(sourceFile, function (node) {
            if (node.kind === typescript_1.default.SyntaxKind.ClassDeclaration) {
                return typescript_1.default.visitEachChild(node, function (node) {
                    if (node.kind === typescript_1.default.SyntaxKind.Constructor || node.kind === typescript_1.default.SyntaxKind.PropertyDeclaration) {
                        return (0, util_1.traverse)(node, {
                            enter: function (node) {
                                if (node.kind === typescript_1.default.SyntaxKind.ArrowFunction) {
                                    state.enterArrow();
                                }
                                else if (node.kind === typescript_1.default.SyntaxKind.FunctionExpression) {
                                    return node;
                                }
                                else if (state.isInArrow()) {
                                    state.active(node);
                                    if ((0, util_1.isBinaryExpression)(node) && node.operatorToken.kind === typescript_1.default.SyntaxKind.FirstAssignment) {
                                        state.add(node.left);
                                    }
                                    else if ((0, util_1.isCallExpression)(node)) {
                                        state.add(node.expression);
                                    }
                                    else if (state.isActived() && (0, util_1.isPropertyAccessExpression)(node) && node.expression.kind === typescript_1.default.SyntaxKind.ThisKeyword) {
                                        return context.factory.updatePropertyAccessExpression(node, context.factory.createCallExpression(state.identifier, [], [node.expression]), node.name);
                                    }
                                }
                            },
                            exit: function (node) {
                                if (node.kind === typescript_1.default.SyntaxKind.ArrowFunction) {
                                    state.leaveArrow();
                                }
                                else {
                                    state.leave(node);
                                }
                            }
                        }, context);
                    }
                    return node;
                }, context);
            }
            return node;
        }, context);
        if (state.isChanged()) {
            return (0, util_1.addStatement)(sourceFile, typescript_1.default.factory.createVariableStatement(undefined, typescript_1.default.factory.createVariableDeclarationList([
                typescript_1.default.factory.createVariableDeclaration(state.identifier, undefined, undefined, typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.createIdentifier('require'), undefined, [typescript_1.default.createStringLiteral('@vue/reactivity')]), typescript_1.default.createIdentifier('reactive')), typescript_1.default.factory.createFunctionTypeNode([
                    typescript_1.default.factory.createTypeParameterDeclaration('T')
                ], [
                    typescript_1.default.factory.createParameterDeclaration(undefined, undefined, undefined, 'data', undefined, typescript_1.default.factory.createTypeReferenceNode("T"))
                ], typescript_1.default.factory.createTypeReferenceNode("T"))))
            ], typescript_1.default.NodeFlags.Const)));
        }
        return sourceFile;
    };
};
exports.default = fixVue3This;
