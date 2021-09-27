"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var diff_1 = __importDefault(require("./diff"));
var RuntimeStore = /** @class */ (function () {
    function RuntimeStore() {
        this.diff = new diff_1.default;
        this.events = {};
        /**框架组件属性代理 */
        this.propRecord = {};
        this.propProxy = {};
        /**事件属性代理 */
        this.fnRecord = {};
        this.fnProxy = {};
    }
    RuntimeStore.prototype.addProp = function (key, value, native) {
        if (value === undefined) {
            value = null;
        }
        else if (native) {
            if (isObject(value)) {
                value = this.proxyProp(value, key);
            }
            else if (typeof value === 'function') {
                value = this.proxyFn(value, key);
            }
        }
        this.diff.add(key, value, native);
    };
    RuntimeStore.prototype.start = function () {
        this.diff.reset();
    };
    RuntimeStore.prototype.end = function () {
        return this.diff.get();
    };
    RuntimeStore.prototype.addEvent = function (key, fn) {
        this.events[key] = fn;
    };
    RuntimeStore.prototype.runEvent = function (key, arg) {
        this.events[key].call(null, arg);
    };
    RuntimeStore.prototype.proxyProp = function (value, key) {
        var k = Array.isArray(key) ? key.join('_') : key;
        if (this.propRecord[k] !== value) {
            this.propRecord[k] = value;
            this.propProxy[k] = (0, utils_1.buildMPData)(value);
        }
        return this.propProxy[k];
    };
    RuntimeStore.prototype.proxyFn = function (value, key) {
        var _this = this;
        var k = Array.isArray(key) ? key.join('_') : key;
        this.fnRecord[k] = value;
        if (!this.fnProxy[k]) {
            this.fnProxy[k] = (0, utils_1.buildMPData)(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _this.fnRecord[k].apply(null, args);
            });
        }
        return this.fnProxy[k];
    };
    RuntimeStore.prototype.destroy = function () {
        this.diff.destroy();
        this.events = null;
        this.fnRecord = null;
        this.fnProxy = null;
        this.propRecord = null;
        this.propRecord = null;
    };
    return RuntimeStore;
}());
exports.default = RuntimeStore;
function isObject(data) {
    return typeof data === 'object' && data !== null;
}
