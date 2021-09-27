"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tsconfig_paths_webpack_plugin_1 = __importDefault(require("tsconfig-paths-webpack-plugin"));
var path_1 = __importDefault(require("path"));
var TsconfigPathsWebpackContextPlugin = /** @class */ (function () {
    function TsconfigPathsWebpackContextPlugin(rawOptions) {
        if (rawOptions === void 0) { rawOptions = {}; }
        this.options = rawOptions;
    }
    TsconfigPathsWebpackContextPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.afterPlugins.tap('TsconfigPathsWebpackContextPlugin', function (compiler) {
            var tsconfigPathsPlugin = new tsconfig_paths_webpack_plugin_1.default(__assign(__assign({}, _this.options), { configFile: _this.options.configFile || path_1.default.resolve(compiler.options.context || '', './tsconfig.json') }));
            compiler.options.resolve = compiler.options.resolve || {};
            compiler.options.resolve.plugins = (compiler.options.resolve.plugins || []).concat(tsconfigPathsPlugin);
        });
    };
    return TsconfigPathsWebpackContextPlugin;
}());
exports.default = TsconfigPathsWebpackContextPlugin;
