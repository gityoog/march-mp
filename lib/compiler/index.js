"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsconfigPathsWebpackContextPlugin = exports.fixVue3This = exports.ProcessPlugin = void 0;
var plugin_1 = __importDefault(require("./entry/plugin"));
var process_plugin_1 = __importDefault(require("./utils/process-plugin"));
exports.ProcessPlugin = process_plugin_1.default;
var fix_vue3_this_1 = __importDefault(require("./utils/ts-transformer/fix-vue3-this"));
exports.fixVue3This = fix_vue3_this_1.default;
var tsconfig_paths_webpack_context_plugin_1 = __importDefault(require("./utils/tsconfig-paths-webpack-context-plugin"));
exports.TsconfigPathsWebpackContextPlugin = tsconfig_paths_webpack_context_plugin_1.default;
exports.default = plugin_1.default;
