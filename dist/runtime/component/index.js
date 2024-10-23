"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("../base");
var reactivity_1 = require("../reactivity");
var utils_1 = require("../utils");
var MPComponent = /** @class */ (function (_super) {
    __extends(MPComponent, _super);
    function MPComponent(args) {
        if (args === void 0) { args = {}; }
        var _this = _super.call(this) || this;
        Object.defineProperty(_this, '$props', {
            enumerable: false,
            writable: true,
            configurable: true,
            value: {}
        });
        return _this;
    }
    MPComponent.create = function (_a) {
        var properties = _a.properties, events = _a.events;
        var methods = this.initEventsMethods(events);
        this.properties = properties;
        // 将默认值赋值给properties
        for (var key in this.properties) {
            if (this.propsDefault[key] !== undefined) {
                this.properties[key] = {
                    type: this.properties[key],
                    value: this.propsDefault[key],
                };
            }
        }
        var observers = {};
        var _loop_1 = function (key) {
            var obMethodName = this_1.observers[key];
            observers[key] = function (newData) {
                var data = Self.getData(this);
                var oldValue = data.$props[key];
                if (!(0, utils_1.isMPDataReady)(newData)) {
                    console.log('MPData is not Ready', newData);
                    return;
                }
                var newValue = (0, utils_1.originMPData)(newData, this.is + '->observers->' + key);
                if (oldValue === newValue) {
                    return;
                }
                reactivity_1.default.set(data.$props, key, newValue);
                // data.$props[key] = newValue
                if (obMethodName) {
                    // 运行监控数据映射的函数
                    var method = data[obMethodName];
                    if (method) {
                        method.apply(data, [newValue, oldValue]);
                    }
                    else {
                        console.error("observer method ".concat(obMethodName, " is not exist"));
                    }
                }
            };
        };
        var this_1 = this;
        // 映射定义的监控变量和触发函数
        for (var key in this.properties) {
            _loop_1(key);
        }
        var Self = this;
        return Component({
            options: __assign({}, this.$options),
            observers: observers,
            properties: this.properties,
            lifetimes: {
                created: function () {
                    var _a;
                    var data = new Self();
                    Self.bindData(this, data);
                    (_a = data.created) === null || _a === void 0 ? void 0 : _a.call(data);
                },
                attached: function () {
                    var data = Self.init(this, Self.getData(this), function () {
                        var _a;
                        (_a = data.attached) === null || _a === void 0 ? void 0 : _a.call(data);
                    });
                },
                detached: function () {
                    var _a;
                    var data = Self.getData(this);
                    (_a = data.detached) === null || _a === void 0 ? void 0 : _a.call(data);
                    Self.destory(this);
                }
            },
            methods: methods
        });
    };
    /**组件数据监控 { 字段名称: 运行的组件方法名称 } */
    MPComponent.observers = {};
    /**组件参数默认值 */
    MPComponent.propsDefault = {};
    /**组件参数 编译后覆盖 */
    MPComponent.properties = {};
    MPComponent.$options = {};
    return MPComponent;
}(base_1.default));
exports.default = MPComponent;
