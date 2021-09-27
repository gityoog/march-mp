"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markRaw = exports.toRaw = exports.MPComponent = exports.MPPage = void 0;
var component_1 = require("./component");
exports.MPComponent = component_1.default;
var page_1 = require("./page");
exports.MPPage = page_1.default;
var reactive_1 = require("./vue/reactive");
Object.defineProperty(exports, "toRaw", { enumerable: true, get: function () { return reactive_1.toRaw; } });
Object.defineProperty(exports, "markRaw", { enumerable: true, get: function () { return reactive_1.markRaw; } });
var MarchMP = {
    Page: page_1.default,
    Component: component_1.default,
};
exports.default = MarchMP;
