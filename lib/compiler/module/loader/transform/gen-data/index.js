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
const t = __importStar(require("@babel/types"));
// todo 修改为排除原则
function genData(path, state) {
    (path.parentPath || path).traverse({
        /**
          1. a.call(b) -> $data
          2. 转换map函数 并记录map使用到的item 和index作用域
         */
        CallExpression: {
            enter: (path) => {
                if (isMapCallExpression(path.node)) {
                    const scope = state.genMap(path);
                    state.enterMap(path, scope);
                }
                else {
                    state.genProp(path);
                }
            },
            exit: (path) => {
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
            enter: (path) => {
                if (path.node.operator === '||') {
                    state.genProp(path);
                }
                else {
                    const left = path.get('left');
                    state.genProp(left);
                    const right = path.get('right');
                    if (isData(right)) {
                        state.genProp(right);
                    }
                }
            }
        },
        ConditionalExpression: {
            enter: (path) => {
                const test = path.get('test');
                const alternate = path.get('alternate');
                const consequent = path.get('consequent');
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
            enter: path => {
                if (path.parentPath.isJSXElement()) {
                    const expression = path.get('expression');
                    if (isData(expression)) {
                        state.genProp(expression);
                    }
                }
            }
        },
        JSXOpeningElement: {
            enter: path => {
                var _a;
                const name = path.get('name');
                const result = {};
                if (name.isJSXIdentifier()) {
                    const originName = name.node.name;
                    const binding = (_a = name.scope.getBinding(originName)) === null || _a === void 0 ? void 0 : _a.path;
                    if (binding === null || binding === void 0 ? void 0 : binding.isImportDefaultSpecifier()) {
                        const parentPath = binding.parentPath;
                        if (parentPath.isImportDeclaration()) {
                            const componentName = renameComponent(originName);
                            result.name = componentName;
                            result.origin = originName;
                            state.addComponent(componentName, parentPath.node.source.value);
                            name.replaceWith(t.jsxIdentifier(componentName));
                            if (!path.node.selfClosing) {
                                const parent = path.parentPath;
                                if (parent.isJSXElement()) {
                                    const closingElement = parent.get('closingElement');
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
                path.get('attributes').forEach(path => {
                    if (path.isJSXAttribute()) {
                        const value = path.get('value');
                        if (value.isJSXExpressionContainer()) {
                            const nameNode = path.node.name;
                            let name;
                            if (t.isJSXIdentifier(nameNode)) {
                                name = nameNode.name;
                            }
                            else {
                                name = nameNode.namespace.name + ':' + nameNode.name.name;
                            }
                            const expression = value.get('expression');
                            if (/^(bind|catch|mut-bind|capture-bind|capture-catch)/.test(name) && expression.isFunction()) {
                                // 事件
                                const { scope, name } = state.genEvent(expression);
                                if (scope && path.parentPath.isJSXOpeningElement()) {
                                    path.parentPath.node.attributes.push(t.jsxAttribute(t.jsxIdentifier('data-' + name), t.jSXExpressionContainer(scope)));
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
