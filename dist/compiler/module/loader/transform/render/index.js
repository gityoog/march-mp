"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const util_1 = require("../../state/identifier/util");
function transformEffect(render) {
    render.node.params = renderParams;
    render.traverse({
        JSXElement: {
            exit: path => {
                const children = path.node.children.reduce((res, item) => {
                    if (t.isJSXExpressionContainer(item) && !t.isJSXEmptyExpression(item.expression)) {
                        res.push(item.expression);
                    }
                    else if (t.isArrayExpression(item)) {
                        item.elements.forEach(item => {
                            if (t.isExpression(item)) {
                                res.push(item);
                            }
                        });
                    }
                    return res;
                }, []);
                const attrs = path.node.openingElement.attributes
                    .reduce((res, item) => {
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
const typeAnnotation = t.tsTypeAnnotation(t.tsFunctionType(t.tsTypeParameterDeclaration([
    t.tsTypeParameter(null, null, 'T')
]), [
    addTsTypeAnnotation(t.identifier('a'), t.tsTypeAnnotation(t.tsTypeReference(t.identifier('T')))),
    addTsTypeAnnotation(t.restElement(t.identifier('args')), t.tsTypeAnnotation(t.tsAnyKeyword()))
], t.tsTypeAnnotation(t.tsTypeReference(t.identifier('T')))));
const renderParams = [
    addTsTypeAnnotation(t.identifier(util_1.fnName.prop), typeAnnotation),
    addTsTypeAnnotation(t.identifier(util_1.fnName.event), typeAnnotation)
];
function addTsTypeAnnotation(expression, type) {
    // @ts-ignore
    expression.typeAnnotation = type;
    return expression;
}
