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
const t = __importStar(require("@babel/types"));
function getProperties(path) {
    const declaration = path.node;
    const result = [];
    if (t.isTSTypeParameterInstantiation(declaration.superTypeParameters)) {
        const objectType = declaration.superTypeParameters.params[0];
        if (t.isTSTypeLiteral(objectType)) {
            objectType.members.forEach(property => {
                if (t.isTSMethodSignature(property)) {
                    if (t.isIdentifier(property.key)) {
                        result.push(t.objectProperty(property.key, t.identifier('null')));
                    }
                }
                else if (t.isTSPropertySignature(property) && property.typeAnnotation) {
                    if (t.isIdentifier(property.key)) {
                        const type = property.typeAnnotation.typeAnnotation;
                        result.push(t.objectProperty(property.key, t.isTSStringKeyword(type) ?
                            t.identifier('String') :
                            t.isTSNumberKeyword(type) ?
                                t.identifier('Number') :
                                t.isTSBooleanKeyword(type) ?
                                    t.identifier('Boolean') :
                                    t.identifier('null')));
                    }
                }
                else {
                    // `unknown component params type ${property.type}`
                }
            });
        }
    }
    return result;
}
exports.default = getProperties;
