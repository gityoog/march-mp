"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("@babel/types");
function getProperties(path) {
    var declaration = path.node;
    var result = [];
    if (t.isTSTypeParameterInstantiation(declaration.superTypeParameters)) {
        var objectType = declaration.superTypeParameters.params[0];
        if (t.isTSTypeLiteral(objectType)) {
            objectType.members.forEach(function (property) {
                if (t.isTSMethodSignature(property)) {
                    if (t.isIdentifier(property.key)) {
                        result.push(t.objectProperty(property.key, t.identifier('null')));
                    }
                }
                else if (t.isTSPropertySignature(property) && property.typeAnnotation) {
                    if (t.isIdentifier(property.key)) {
                        var type = property.typeAnnotation.typeAnnotation;
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
