"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MPComponent = exports.MPPage = exports.reactive = exports.markRaw = exports.toRaw = void 0;
var component_1 = require("./component");
exports.MPComponent = component_1.default;
var page_1 = require("./page");
exports.MPPage = page_1.default;
var reactivity_1 = require("./reactivity");
var MarchMP = {
    Page: page_1.default,
    Component: component_1.default,
};
function toRaw(data) {
    return reactivity_1.default.toRaw(data);
}
exports.toRaw = toRaw;
function markRaw(data) {
    return reactivity_1.default.markRaw(data);
}
exports.markRaw = markRaw;
function reactive(data) {
    return reactivity_1.default.reactive(data);
}
exports.reactive = reactive;
exports.default = MarchMP;
