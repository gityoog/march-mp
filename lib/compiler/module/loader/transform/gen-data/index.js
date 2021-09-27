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
exports.isMapCallExpression = void 0;
var t = __importStar(require("@babel/types"));
function genData(path, state) {
    (path.parentPath || path).traverse({
        /**
          1. a.call(b) -> $data
          2. 转换map函数 并记录map使用到的item 和index作用域
         */
        CallExpression: {
            enter: function (path) {
                if (isMapCallExpression(path.node)) {
                    var scope = state.genMap(path);
                    state.enterMap(path, scope);
                }
                else {
                    state.genProp(path);
                }
            },
            exit: function (path) {
                if (isMapCallExpression(path.node)) {
                    state.exitMap();
                }
            }
        },
        /**
         * a || b -> $data
         * a && b && <div></div> -> $data && <div></div>
         */
        LogicalExpression: {
            enter: function (path) {
                if (path.node.operator === '||') {
                    state.genProp(path);
                }
                else {
                    var left = path.get('left');
                    state.genProp(left);
                    var right = path.get('right');
                    if (isData(right)) {
                        state.genProp(right);
                    }
                }
            }
        },
        ConditionalExpression: {
            enter: function (path) {
                var test = path.get('test');
                var alternate = path.get('alternate');
                var consequent = path.get('consequent');
                state.genProp(test);
                if (isData(alternate)) {
                    state.genProp(alternate);
                }
                if (isData(consequent)) {
                    state.genProp(consequent);
                }
            }
        },
        // jsxElement children下的 {data} -> {$data}
        JSXExpressionContainer: {
            enter: function (path) {
                if (path.parentPath.isJSXElement()) {
                    var expression = path.get('expression');
                    if (isData(expression)) {
                        state.genProp(expression);
                    }
                }
            }
        },
        JSXOpeningElement: {
            enter: function (path) {
                var _a;
                var name = path.get('name');
                var result = {};
                if (name.isJSXIdentifier()) {
                    var originName = name.node.name;
                    var binding = (_a = name.scope.getBinding(originName)) === null || _a === void 0 ? void 0 : _a.path;
                    if (binding === null || binding === void 0 ? void 0 : binding.isImportDefaultSpecifier()) {
                        var parentPath = binding.parentPath;
                        if (parentPath.isImportDeclaration()) {
                            var componentName = renameComponent(originName);
                            result.name = componentName;
                            result.origin = originName;
                            state.addComponent(componentName, parentPath.node.source.value);
                            name.replaceWith(t.jsxIdentifier(componentName));
                            if (!path.node.selfClosing) {
                                var parent_1 = path.parentPath;
                                if (parent_1.isJSXElement()) {
                                    var closingElement = parent_1.get('closingElement');
                                    closingElement.get('name').replaceWith(t.jsxIdentifier(componentName));
                                }
                            }
                        }
                    }
                }
                /**
                 * 转换标签属性
                 * attr={expression} -> attr={$data}
                 * event={function} -> event={"$name"}
                 */
                path.get('attributes').forEach(function (path) {
                    if (path.isJSXAttribute()) {
                        var value = path.get('value');
                        if (value.isJSXExpressionContainer()) {
                            var nameNode = path.node.name;
                            var name_1;
                            if (t.isJSXIdentifier(nameNode)) {
                                name_1 = nameNode.name;
                            }
                            else {
                                name_1 = nameNode.namespace.name + ':' + nameNode.name.name;
                            }
                            var expression = value.get('expression');
                            if (/^(bind|catch|mut-bind|capture-bind|capture-catch)/.test(name_1) && expression.isFunction()) {
                                // 事件
                                var _a = state.genEvent(expression), scope = _a.scope, name_2 = _a.name;
                                if (scope && path.parentPath.isJSXOpeningElement()) {
                                    path.parentPath.node.attributes.push(t.jsxAttribute(t.jsxIdentifier('data-' + name_2), t.jSXExpressionContainer(scope)));
                                }
                            }
                            else {
                                // 属性
                                state.genProp(expression, result.name);
                            }
                        }
                    }
                });
            }
        }
    });
}
exports.default = genData;
function renameComponent(origin) {
    return origin.replace(/(.)([A-Z])/g, '$1-$2').toLowerCase();
}
function isData(path) {
    return path.isBinaryExpression() || path.isMemberExpression() || path.isIdentifier() || path.isTemplateLiteral();
}
function isMapCallExpression(node) {
    return t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.property) && node.callee.property.name === 'map';
}
exports.isMapCallExpression = isMapCallExpression;
