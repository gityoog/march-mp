"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var DiffState = /** @class */ (function () {
    function DiffState() {
        this.data = [];
        this.dict = {};
    }
    DiffState.prototype.add = function (keys) {
        var children = Array.isArray(keys) ? __spreadArray([], __read(keys), false) : [keys];
        var result = {
            dict: this.dict,
            children: this.data
        };
        while (result.dict && result.children && children.length > 0) {
            var key = children.splice(0, 1)[0];
            var hasNext = children.length > 0;
            if (!result.dict[key]) {
                var data_1 = {
                    name: typeof key === 'number' ? "[" + key + "]" : "." + key,
                    path: key,
                    dict: hasNext ? {} : null,
                    children: hasNext ? [] : null,
                    get length() {
                        if (this.children) {
                            return this.children.reduce(function (s, i) { return s + i.length; }, 0);
                        }
                        return 1;
                    }
                };
                result.dict[key] = data_1;
                result.children.push(data_1);
            }
            var data = result.dict[key];
            if (data.length > 20) {
                data.children = data.dict = null;
            }
            result.dict = data.dict;
            result.children = data.children;
        }
    };
    DiffState.prototype.get = function () {
        var result = [];
        var forEach = function (data, name, path) {
            name = name + data.name;
            path = path.concat(data.path);
            if (data.children) {
                data.children.forEach(function (item) {
                    forEach(item, name, path);
                });
            }
            else {
                result.push({
                    name: name,
                    path: path
                });
            }
        };
        this.data.forEach(function (item) {
            forEach(item, '', []);
        });
        return result;
    };
    DiffState.prototype.reset = function () {
        this.data = [];
        this.dict = {};
    };
    DiffState.prototype.destroy = function () {
        this.data = null;
        this.dict = null;
    };
    return DiffState;
}());
exports.default = DiffState;
