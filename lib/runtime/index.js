"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactive = exports.markRaw = exports.toRaw = exports.MPComponent = exports.MPPage = void 0;
var component_1 = __importDefault(require("./component"));
exports.MPComponent = component_1.default;
var page_1 = __importDefault(require("./page"));
exports.MPPage = page_1.default;
var _vue_reactivity_1 = require("./@vue_reactivity");
Object.defineProperty(exports, "toRaw", { enumerable: true, get: function () { return _vue_reactivity_1.toRaw; } });
Object.defineProperty(exports, "markRaw", { enumerable: true, get: function () { return _vue_reactivity_1.markRaw; } });
Object.defineProperty(exports, "reactive", { enumerable: true, get: function () { return _vue_reactivity_1.reactive; } });
var MarchMP = {
    Page: page_1.default,
    Component: component_1.default,
};
exports.default = MarchMP;
