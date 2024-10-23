"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _vue_reactivity_1 = require("../../@vue_reactivity");
var ProxyReactivity = {
    reactive: function (data) {
        return (0, _vue_reactivity_1.reactive)(data);
    },
    effect: function (callback) {
        var result = (0, _vue_reactivity_1.effect)(function () {
            callback(function () { return (0, _vue_reactivity_1.pauseTracking)(); }, function () { return (0, _vue_reactivity_1.enableTracking)(); });
        });
        return function () {
            (0, _vue_reactivity_1.stop)(result);
        };
    },
    toRaw: function (data) {
        return (0, _vue_reactivity_1.toRaw)(data);
    },
    markRaw: function (data) {
        return (0, _vue_reactivity_1.markRaw)(data);
    },
    set: function (data, key, value) {
        data[key] = value;
    }
};
exports.default = ProxyReactivity;
