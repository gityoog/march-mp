"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("@babel/types");
var util_1 = require("../../state/identifier/util");
function transformEffect(render) {
    render.node.params = renderParams;
    render.traverse({
        JSXElement: {
            exit: function (path) {
                var children = path.node.children.reduce(function (res, item) {
                    if (t.isJSXExpressionContainer(item) && !t.isJSXEmptyExpression(item.expression)) {
                        res.push(item.expression);
                    }
                    else if (t.isArrayExpression(item)) {
                        item.elements.forEach(function (item) {
                            if (t.isExpression(item)) {
                                res.push(item);
                            }
                        });
                    }
                    return res;
                }, []);
                var attrs = path.node.openingElement.attributes
                    .reduce(function (res, item) {
                    if (t.isJSXAttribute(item) && t.isJSXExpressionContainer(item.value) && !t.isJSXEmptyExpression(item.value.expression)) {
                        if (t.isJSXIdentifier(item.name) && !/^data-/.test(item.name.name)) {
                            res.push(item.value.expression);
                        }
                    }
                    return res;
                }, []);
                if (children.length > 0 || attrs.length > 0) {
                    path.replaceWith(t.arrayExpression(children.concat(attrs)));
                }
                else {
                    if (path.parentPath.isConditionalExpression()) {
                        path.replaceWith(t.nullLiteral());
                    }
                    else {
                        path.remove();
                    }
                }
            }
        }
    });
}
exports.default = transformEffect;
var typeAnnotation = t.tsTypeAnnotation(t.tsFunctionType(t.tsTypeParameterDeclaration([
    t.tsTypeParameter(null, null, 'T')
]), [
    addTsTypeAnnotation(t.identifier('a'), t.tsTypeAnnotation(t.tsTypeReference(t.identifier('T')))),
    addTsTypeAnnotation(t.restElement(t.identifier('args')), t.tsTypeAnnotation(t.tsAnyKeyword()))
], t.tsTypeAnnotation(t.tsTypeReference(t.identifier('T')))));
var renderParams = [
    addTsTypeAnnotation(t.identifier(util_1.fnName.prop), typeAnnotation),
    addTsTypeAnnotation(t.identifier(util_1.fnName.event), typeAnnotation)
];
function addTsTypeAnnotation(expression, type) {
    // @ts-ignore
    expression.typeAnnotation = type;
    return expression;
}
