"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
var Diff = /** @class */ (function () {
    function Diff() {
        this.data = {};
        this.state = new state_1.default;
    }
    Diff.prototype.reset = function () {
        this.state.reset();
    };
    Diff.prototype.get = function () {
        var _this = this;
        var data = this.state.get();
        if (data.length > 0) {
            var result_1 = {};
            data.forEach(function (item) {
                result_1[item.name] = _this.getValue(item.path);
            });
            return result_1;
        }
    };
    Diff.prototype.add = function (key, value, native) {
        var oldValue = this.getValue(key);
        if (native) {
            if (oldValue !== value) {
                this.setValue(key, value);
                this.state.add(key);
            }
        }
        else {
            var newValue = this.deep(oldValue, value, key);
            if (newValue !== oldValue) {
                this.setValue(key, newValue);
            }
        }
    };
    Diff.prototype.destroy = function () {
        this.state.destroy();
        this.data = null;
    };
    Diff.prototype.getValue = function (key) {
        return Array.isArray(key) ? get(this.data, key) : this.data[key];
    };
    Diff.prototype.setValue = function (key, value) {
        if (Array.isArray(key)) {
            set(this.data, key, value);
        }
        else {
            this.data[key] = value;
        }
    };
    Diff.prototype.deep = function (value, newValue, keys) {
        var _this = this;
        if (Array.isArray(newValue)) {
            if (keys !== undefined && (!value || value.length !== newValue.length)) {
                this.state.add(keys);
                keys = undefined;
            }
            return newValue.map(function (item, index) { return _this.deep(value ? value[index] : undefined, item, keys !== undefined ? concat(keys, index) : undefined); });
        }
        else if (isRecord(newValue)) {
            var result = {};
            for (var key in newValue) {
                result[key] = this.deep(value ? value[key] : undefined, newValue[key], keys !== undefined ? concat(keys, key) : undefined);
            }
            return result;
        }
        else {
            if (keys !== undefined && value !== newValue) {
                this.state.add(keys);
            }
            return newValue;
        }
    };
    return Diff;
}());
exports.default = Diff;
function concat(keys, key) {
    return [].concat(keys).concat(key);
}
function get(obj, keys) {
    var e_1, _a;
    try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            obj = obj[key];
            if (obj === undefined) {
                return obj;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return obj;
}
function set(obj, keys, value) {
    keys.slice(0, -1).forEach(function (key) {
        if (!obj[key]) {
            obj[key] = [];
        }
        obj = obj[key];
    });
    obj[keys.slice(-1)[0]] = value;
}
function isObject(data) {
    return typeof data === 'object' && data !== null;
}
function isRecord(data) {
    return Object.prototype.toString.call(data) === '[object Object]';
}
