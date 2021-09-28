"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsxLoader = exports.valueLoader = exports.TsconfigPathsWebpackContextPlugin = exports.fixVue3This = exports.ProcessPlugin = void 0;
const plugin_1 = __importDefault(require("./entry/plugin"));
const process_plugin_1 = __importDefault(require("./utils/process-plugin"));
exports.ProcessPlugin = process_plugin_1.default;
const fix_vue3_this_1 = __importDefault(require("./utils/ts-transformer/fix-vue3-this"));
exports.fixVue3This = fix_vue3_this_1.default;
const tsconfig_paths_webpack_context_plugin_1 = __importDefault(require("./utils/tsconfig-paths-webpack-context-plugin"));
exports.TsconfigPathsWebpackContextPlugin = tsconfig_paths_webpack_context_plugin_1.default;
const valueLoader = require.resolve('./utils/value-loader');
exports.valueLoader = valueLoader;
const tsxLoader = require.resolve('./module/loader');
exports.tsxLoader = tsxLoader;
exports.default = plugin_1.default;
