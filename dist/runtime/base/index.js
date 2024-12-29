"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reactivity_1 = require("../reactivity");
var store_1 = require("./store");
var MPBase = /** @class */ (function () {
    function MPBase() {
        this.$store = new store_1.default;
        this.$ready = false;
        this.$readyCallback = [];
        this.$destoryCallback = [];
    }
    MPBase.init = function (instance, data, callback) {
        var _this = this;
        Object.defineProperty(data, "$this", {
            enumerable: false,
            configurable: false,
            get: function () {
                return reactivity_1.default.markRaw(instance);
            }
        });
        data.$onReady(function () {
            callback === null || callback === void 0 ? void 0 : callback();
        });
        var proxyData = reactivity_1.default.reactive(data);
        var stop = reactivity_1.default.effect(function (pause, resume) {
            if (!data.$store) {
                return;
            }
            var timeId = instance.is + Math.random();
            if (_this.debug) {
                console.time(timeId);
            }
            data.$store.start();
            proxyData.render(
            // prop 构建
            function (value, key, native) {
                data.$store.addProp(key, reactivity_1.default.toRaw(value), native);
                return value;
            }, 
            // event 构建
            function (fn, key) {
                data.$store.addEvent(Array.isArray(key) ? key.join('.') : key, fn);
                return fn;
            });
            pause();
            try {
                var state = data.$store.end();
                if (_this.debug) {
                    console.timeEnd(timeId);
                }
                if (state) {
                    if (_this.debug) {
                        console.log(instance.is, state);
                    }
                    instance.setData(state, function () {
                        if (!data.$ready) {
                            data.$setReady();
                        }
                    });
                }
            }
            catch (e) {
                throw e;
            }
            finally {
                resume();
            }
        });
        data.$destoryCallback.push(function () {
            stop();
        });
        return this.bindData(instance, proxyData);
    };
    MPBase.bindData = function (instance, data) {
        this.dataMap.set(instance, data);
        return data;
    };
    MPBase.getData = function (instance) {
        return this.dataMap.get(instance);
    };
    MPBase.getRawData = function (instance) {
        return reactivity_1.default.toRaw(this.getData(instance));
    };
    MPBase.destory = function (instance) {
        this.getData(instance).$destory();
        this.dataMap.delete(instance);
    };
    MPBase.initEventsMethods = function (events) {
        var methods = {};
        var self = this;
        events.forEach(function (name) {
            methods[name] = function (event) {
                var data = self.getData(this);
                var dataset = event.currentTarget.dataset;
                var key = dataset[name] !== undefined ? [name, dataset[name]].join('.') : name;
                data.$store.runEvent(key, event.detail, event);
            };
        });
        return methods;
    };
    MPBase.prototype.$onReady = function (callback) {
        if (this.$ready) {
            callback();
        }
        else {
            this.$readyCallback.push(callback);
        }
    };
    MPBase.prototype.$setReady = function () {
        this.$ready = true;
        this.$readyCallback.forEach(function (cb) { return cb(); });
        this.$readyCallback = [];
    };
    MPBase.prototype.$destory = function () {
        this.$destoryCallback.forEach(function (fn) { return fn(); });
        this.$destoryCallback = [];
        this.$readyCallback = [];
        this.$store.destroy();
        this.$store = null;
    };
    /**编译后覆盖 render函数 */
    MPBase.prototype.render = function (genProp, genEvent) { };
    MPBase.debug = false;
    MPBase.dataMap = new WeakMap();
    return MPBase;
}());
exports.default = MPBase;
