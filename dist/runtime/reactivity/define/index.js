"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_reactivity_1 = require("vue-reactivity");
var DefineReactivity = {
    reactive: function (data) {
        return (0, vue_reactivity_1.reactive)(data);
    },
    effect: function (callback) {
        return (0, vue_reactivity_1.watchEffect)(function () {
            callback(function () { return (0, vue_reactivity_1.pushTarget)(); }, function () { return (0, vue_reactivity_1.popTarget)(); });
        });
    },
    toRaw: function (data) {
        return (0, vue_reactivity_1.toRaw)(data);
    },
    markRaw: function (data) {
        return (0, vue_reactivity_1.markRaw)(data);
    }
};
exports.default = DefineReactivity;
