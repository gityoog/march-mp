"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generator_1 = require("@babel/generator");
var traverse_1 = require("@babel/traverse");
var t = require("@babel/types");
function getWXML(path) {
    var node = t.cloneNode(path.node, true, true);
    var parent = t.jsxExpressionContainer(node);
    (0, traverse_1.default)(parent, {
        noScope: true,
        /**
         a.map((item, index) => <div></div>)
         ->
         <div wx:for={a} wx:for-item={item} wx:for-index={index}></div>
        */
        CallExpression: {
            enter: function (path) {
                var callee = path.node.callee;
                var arrowFn = path.node.arguments[0];
                if (t.isMemberExpression(callee) && t.isArrowFunctionExpression(arrowFn)) {
                    if (!t.isBlockStatement(arrowFn.body) && t.isIdentifier(arrowFn.params[0]) && t.isIdentifier(arrowFn.params[1])) {
                        var node_1 = expressionToJSXElement(arrowFn.body);
                        node_1.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('wx:for'), t.jsxExpressionContainer(callee.object)), t.jsxAttribute(t.jsxIdentifier('wx:for-item'), t.stringLiteral(arrowFn.params[0].name)), t.jsxAttribute(t.jsxIdentifier('wx:for-index'), t.stringLiteral(arrowFn.params[1].name)));
                        path.replaceWith(node_1);
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
            exit: function (path) {
                var _a;
                var node = path.node;
                var consequent = expressionToJSXElement(node.consequent);
                consequent.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('wx:if'), t.jsxExpressionContainer(node.test)));
                var alternate = expressionToJSXElement(node.alternate);
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
            exit: function (path) {
                var node = expressionToJSXElement(path.node.right);
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
            exit: function (path) {
                var nodes = path.node.elements
                    .filter(function (item) { return t.isExpression(item); })
                    .map(function (item) { return expressionToJSXElement(item); });
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
            exit: function (path) {
                var _a;
                var expression = path.get('expression');
                if (expression.isJSXElement()) {
                    path.replaceWith(expression);
                }
                else {
                    var code = expression.isStringLiteral() ? expression.node.value : '{{' + (0, generator_1.default)(expression.node, {
                        jsonCompatibleStrings: false,
                        comments: false
                    }).code.replace(/"/g, "'") + '}}';
                    if ((_a = path.parentPath) === null || _a === void 0 ? void 0 : _a.isJSXElement()) {
                        path.replaceWith(t.jsxText(code));
                    }
                    else {
                        var node_2 = t.stringLiteral(code);
                        node_2.extra = {
                            raw: '"' + node_2.value + '"',
                            rawValue: node_2.value
                        };
                        path.replaceWith(node_2);
                    }
                }
            }
        },
        NullLiteral: {
            enter: function (path) {
                if (path.parentPath.isConditionalExpression()) {
                    path.replaceWith(t.stringLiteral(''));
                }
            }
        },
        JSXElement: {
            enter: function (path) {
                var openingElement = path.get('openingElement');
                var jsxName = openingElement.get('name');
                if (jsxName.isJSXIdentifier() && jsxName.node.name === 'div') {
                    jsxName.replaceWith(t.jsxIdentifier('view'));
                    var closingElement = path.get('closingElement');
                    if (closingElement.isJSXClosingElement()) {
                        var closeName = closingElement.get('name');
                        if (closeName.isJSXIdentifier() && closeName.node.name === 'div') {
                            closeName.replaceWith(t.jsxIdentifier('view'));
                        }
                    }
                }
            }
        },
        JSXAttribute: {
            enter: function (path) {
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
