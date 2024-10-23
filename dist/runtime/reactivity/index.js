"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var define_1 = require("./define");
var proxy_1 = require("./proxy");
var proxy = proxy_1.default;
var define = define_1.default;
var actived = proxy_1.default;
var Reactivity = {
    use: function (type) {
        actived = type === 'proxy' ? proxy : define;
    },
    reactive: function (data) {
        return actived.reactive(data);
    },
    effect: function (callback) {
        return actived.effect(callback);
    },
    toRaw: function (data) {
        return actived.toRaw(data);
    },
    markRaw: function (data) {
        return actived.markRaw(data);
    },
    set: function (data, key, value) {
        actived.set(data, key, value);
    }
};
exports.default = Reactivity;
