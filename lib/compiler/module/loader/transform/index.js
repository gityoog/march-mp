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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var t = __importStar(require("@babel/types"));
var parser = __importStar(require("@babel/parser"));
var traverse_1 = __importDefault(require("@babel/traverse"));
var generator_1 = __importDefault(require("@babel/generator"));
var json_1 = __importDefault(require("./json"));
var render_1 = __importDefault(require("./render"));
var properties_1 = __importDefault(require("./properties"));
var wxml_1 = __importDefault(require("./wxml"));
var add_ready_1 = __importDefault(require("./add-ready"));
var gen_data_1 = __importDefault(require("./gen-data"));
function transform(source, state) {
    var file = parser.parse(source, {
        plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy'],
        sourceType: 'module'
    });
    (0, traverse_1.default)(file, {
        ImportDeclaration: {
            enter: function (path) {
                if (path.node.specifiers.length === 0) {
                    if (/\.(sass|scss|css|wxss)$/.test(path.node.source.value)) {
                        state.addCss(path.node.source.value);
                        path.remove();
                    }
                }
            }
        },
        ExportDefaultDeclaration: {
            enter: function (path) {
                var _a;
                path.skip();
                var declaration = path.get('declaration');
                if (declaration.isClassDeclaration()) {
                    state.setJSON((0, json_1.default)(declaration) || {});
                    var render_2 = declaration.get('body.body').find(function (item) {
                        if (item.isClassMethod()) {
                            var key = item.get('key');
                            if (key.isIdentifier()) {
                                return key.node.name === 'render';
                            }
                        }
                        return false;
                    });
                    if (render_2) {
                        var argument = (_a = render_2.get('body.body').find(function (item) {
                            return item.isReturnStatement();
                        })) === null || _a === void 0 ? void 0 : _a.get('argument');
                        if (argument === null || argument === void 0 ? void 0 : argument.isExpression()) {
                            (0, add_ready_1.default)(argument);
                            (0, gen_data_1.default)(argument, state);
                            state.setWXML((0, generator_1.default)((0, wxml_1.default)(argument), { comments: false }).code);
                        }
                        state.before(function () {
                            (0, render_1.default)(render_2);
                        });
                    }
                    /**
                     * export default class -> (class).create({
                     *   events: [],
                     *   properties: {}
                     * })
                     **/
                    path.replaceWith(t.expressionStatement(t.callExpression(t.memberExpression(t.toExpression(declaration.node), t.identifier('create')), [
                        t.objectExpression([
                            t.objectProperty(t.identifier('events'), t.valueToNode(state.events)),
                            t.objectProperty(t.identifier('properties'), t.objectExpression((0, properties_1.default)(declaration)))
                        ])
                    ])));
                }
            }
        }
    });
    state.setGenerator(function () {
        return (0, generator_1.default)(file, { comments: false }).code;
    });
}
exports.default = transform;
