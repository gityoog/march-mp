"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsxLoader = exports.valueLoader = exports.fixVue3This = void 0;
const plugin_1 = __importDefault(require("./entry/plugin"));
const fix_vue3_this_1 = __importDefault(require("./ts-transformer/fix-vue3-this"));
exports.fixVue3This = fix_vue3_this_1.default;
const valueLoader = require.resolve('./value-loader');
exports.valueLoader = valueLoader;
const tsxLoader = require.resolve('./module/loader');
exports.tsxLoader = tsxLoader;
exports.default = plugin_1.default;
