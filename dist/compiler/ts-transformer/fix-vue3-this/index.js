"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const state_1 = __importDefault(require("./state"));
const util_1 = require("../util");
const fixVue3This = (context) => {
    return sourceFile => {
        if (sourceFile.languageVariant !== typescript_1.default.LanguageVariant.Standard || sourceFile.isDeclarationFile) {
            return sourceFile;
        }
        const state = new state_1.default();
        sourceFile = typescript_1.default.visitEachChild(sourceFile, node => {
            if (node.kind === typescript_1.default.SyntaxKind.ClassDeclaration) {
                return typescript_1.default.visitEachChild(node, node => {
                    if (typescript_1.default.isConstructorDeclaration(node) || typescript_1.default.isPropertyDeclaration(node)) {
                        return (0, util_1.traverse)(node, {
                            enter: node => {
                                if (node.kind === typescript_1.default.SyntaxKind.ArrowFunction) {
                                    state.enterArrow();
                                }
                                else if (node.kind === typescript_1.default.SyntaxKind.FunctionExpression) {
                                    return node;
                                }
                                else if (state.isInArrow()) {
                                    state.active(node);
                                    if (typescript_1.default.isBinaryExpression(node) && node.operatorToken.kind === typescript_1.default.SyntaxKind.FirstAssignment) {
                                        state.add(node.left);
                                    }
                                    else if (typescript_1.default.isCallExpression(node)) {
                                        state.add(node.expression);
                                    }
                                    else if (state.isActived() && typescript_1.default.isPropertyAccessExpression(node) && node.expression.kind === typescript_1.default.SyntaxKind.ThisKeyword) {
                                        return context.factory.updatePropertyAccessExpression(node, context.factory.createCallExpression(state.identifier, [], [node.expression]), node.name);
                                    }
                                }
                            },
                            exit: node => {
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
                typescript_1.default.factory.createVariableDeclaration(state.identifier, undefined, undefined, typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier('require'), undefined, [typescript_1.default.factory.createStringLiteral('march-mp')]), typescript_1.default.factory.createIdentifier('reactive')), typescript_1.default.factory.createFunctionTypeNode([
                    typescript_1.default.factory.createTypeParameterDeclaration(undefined, 'T')
                ], [
                    typescript_1.default.factory.createParameterDeclaration(undefined, undefined, 'data', undefined, typescript_1.default.factory.createTypeReferenceNode("T"))
                ], typescript_1.default.factory.createTypeReferenceNode("T"))))
            ], typescript_1.default.NodeFlags.Const)));
        }
        return sourceFile;
    };
};
exports.default = fixVue3This;
