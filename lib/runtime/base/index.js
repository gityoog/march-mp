"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var reactive_1 = require("../vue/reactive");
var store_1 = __importDefault(require("./store"));
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
                return (0, reactive_1.markRaw)(instance);
            }
        });
        data.$onReady(function () {
            callback === null || callback === void 0 ? void 0 : callback();
        });
        var proxyData = (0, reactive_1.reactive)(data);
        var reffect = (0, reactive_1.effect)(function () {
            var timeId = instance.is + Math.random();
            if (_this.debug) {
                console.time(timeId);
            }
            data.$store.start();
            proxyData.render(
            // prop 构建
            function (value, key, native) {
                data.$store.addProp(key, (0, reactive_1.toRaw)(value), native);
                return value;
            }, 
            // event 构建
            function (fn, key) {
                data.$store.addEvent(Array.isArray(key) ? key.join('.') : key, fn);
                return fn;
            });
            (0, reactive_1.pauseTracking)();
            var state = data.$store.end();
            if (_this.debug || true) {
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
            (0, reactive_1.enableTracking)();
        });
        data.$destoryCallback.push(function () {
            (0, reactive_1.stop)(reffect);
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
        return (0, reactive_1.toRaw)(this.getData(instance));
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
                data.$store.runEvent(key, event.detail);
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
    };
    /**编译后覆盖 render函数 */
    MPBase.prototype.render = function (genProp, genEvent) { };
    MPBase.debug = false;
    MPBase.dataMap = new WeakMap();
    return MPBase;
}());
exports.default = MPBase;
