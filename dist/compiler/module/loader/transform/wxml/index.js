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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = __importDefault(require("@babel/generator"));
const traverse_1 = __importDefault(require("@babel/traverse"));
const t = __importStar(require("@babel/types"));
function getWXML(path) {
    const node = t.cloneNode(path.node, true, true);
    const parent = t.jsxExpressionContainer(node);
    (0, traverse_1.default)(parent, {
        noScope: true,
        /**
         a.map((item, index) => <div></div>)
         ->
         <div wx:for={a} wx:for-item={item} wx:for-index={index}></div>
        */
        CallExpression: {
            enter: path => {
                const callee = path.node.callee;
                const arrowFn = path.node.arguments[0];
                if (t.isMemberExpression(callee) && t.isArrowFunctionExpression(arrowFn)) {
                    if (!t.isBlockStatement(arrowFn.body) && t.isIdentifier(arrowFn.params[0]) && t.isIdentifier(arrowFn.params[1])) {
                        const node = expressionToJSXElement(arrowFn.body);
                        node.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('wx:for'), t.jsxExpressionContainer(callee.object)), t.jsxAttribute(t.jsxIdentifier('wx:for-item'), t.stringLiteral(arrowFn.params[0].name)), t.jsxAttribute(t.jsxIdentifier('wx:for-index'), t.stringLiteral(arrowFn.params[1].name)));
                        path.replaceWith(node);
                    }
                }
            }
        },
        /**
          a ? b : <div>c</div>
          ->
          <block wx:if={a}>b</block>
          <div wx:else>c</div>
         */
        ConditionalExpression: {
            exit: path => {
                var _a;
                const node = path.node;
                const consequent = expressionToJSXElement(node.consequent);
                consequent.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('wx:if'), t.jsxExpressionContainer(node.test)));
                const alternate = expressionToJSXElement(node.alternate);
                alternate.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('wx:else')));
                if (!path.parentPath) {
                    path.replaceWith(t.arrayExpression([
                        consequent,
                        alternate
                    ]));
                }
                // 如果位于jsxElement不需要block
                else if ((_a = path.parentPath.parentPath) === null || _a === void 0 ? void 0 : _a.isJSXElement()) {
                    path.parentPath.replaceWithMultiple([
                        consequent,
                        alternate
                    ]);
                }
                else {
                    path.replaceWith(createBlock([
                        consequent,
                        alternate
                    ]));
                }
            }
        },
        /**
          1. a && <div></div> -> <div wx:if={a}></div>
          2. a && b -> <block wx:if={a}>{b}</block>
          3. a || b -> <block wx:if={!a}>{b}</block>
         */
        LogicalExpression: {
            exit: path => {
                const node = expressionToJSXElement(path.node.right);
                node.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('wx:if'), t.jsxExpressionContainer(path.node.operator === '||' ?
                    t.unaryExpression('!', path.node.left) :
                    path.node.left)));
                path.replaceWith(node);
            }
        },
        /**
          [<div></div>] -> <div></div>
          [<div></div>, <div></div>, 1, '2']
          ->
          <block>
            <div></div>
            <div></div>
            <block>{1}</block>
            <block>{'2'}</block>
          </block>
         */
        ArrayExpression: {
            exit: path => {
                const nodes = path.node.elements
                    .filter(item => t.isExpression(item))
                    .map(item => expressionToJSXElement(item));
                path.replaceWith(nodes.length === 1 ? nodes[0] : createBlock(nodes));
            }
        },
        /**
         1. {<div></div>} -> <div></div>
         2. <div prop={expression}>{expression}</div>
            ->
            <div prop="{{ expression }}">{{ expression }}</div>
         */
        JSXExpressionContainer: {
            exit: path => {
                var _a;
                const expression = path.get('expression');
                if (expression.isJSXElement()) {
                    path.replaceWith(expression);
                }
                else {
                    const code = expression.isStringLiteral() ? expression.node.value : '{{' + (0, generator_1.default)(expression.node, {
                        jsonCompatibleStrings: false,
                        comments: false
                    }).code.replace(/"/g, "'") + '}}';
                    if ((_a = path.parentPath) === null || _a === void 0 ? void 0 : _a.isJSXElement()) {
                        path.replaceWith(t.jsxText(code));
                    }
                    else {
                        const node = t.stringLiteral(code);
                        node.extra = {
                            raw: '"' + node.value + '"',
                            rawValue: node.value
                        };
                        path.replaceWith(node);
                    }
                }
            }
        },
        NullLiteral: {
            enter: path => {
                if (path.parentPath.isConditionalExpression()) {
                    path.replaceWith(t.stringLiteral(''));
                }
            }
        },
        JSXElement: {
            enter: path => {
                const openingElement = path.get('openingElement');
                const jsxName = openingElement.get('name');
                if (jsxName.isJSXIdentifier() && jsxName.node.name === 'div') {
                    jsxName.replaceWith(t.jsxIdentifier('view'));
                    const closingElement = path.get('closingElement');
                    if (closingElement.isJSXClosingElement()) {
                        const closeName = closingElement.get('name');
                        if (closeName.isJSXIdentifier() && closeName.node.name === 'div') {
                            closeName.replaceWith(t.jsxIdentifier('view'));
                        }
                    }
                }
            }
        },
        JSXAttribute: {
            enter: path => {
                if (path.node.name.name === 'key') {
                    path.get('name').replaceWith(t.jsxIdentifier('wx:key'));
                }
            }
        }
    });
    return parent.expression;
}
exports.default = getWXML;
/**
 * 1. <div></div> -> <div></div>
 * 2. '123' -> <block>123</block>
 * 3. expression -> <block>{expression}</block>
 */
function expressionToJSXElement(expression) {
    return t.isJSXElement(expression) ? expression : createBlock([t.isStringLiteral(expression) ? t.jsxText(expression.value) : t.jsxExpressionContainer(expression)]);
}
function createBlock(children) {
    return t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('block'), []), t.jsxClosingElement(t.jsxIdentifier('block')), children, false);
}
