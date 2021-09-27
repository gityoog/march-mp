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
var readySymbol = Symbol();
var MPPage = /** @class */ (function (_super) {
    __extends(MPPage, _super);
    function MPPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MPPage.create = function (_a) {
        var events = _a.events;
        var methods = this.initEventsMethods(events);
        var Self = this;
        return Page(__assign({ onLoad: function (args) {
                var _this = this;
                var data = Self.init(this, new Self(), function () {
                    var _a, _b;
                    (_a = data.onLoad) === null || _a === void 0 ? void 0 : _a.call(data, args);
                    (_b = data.onShow) === null || _b === void 0 ? void 0 : _b.call(data);
                    Reflect.set(_this, readySymbol, true);
                });
            }, onReady: function () {
                var data = Self.getData(this);
                data.$onReady(function () {
                    var _a;
                    (_a = data.onReady) === null || _a === void 0 ? void 0 : _a.call(data);
                });
            }, onShow: function () {
                var _a;
                if (Reflect.get(this, readySymbol)) {
                    var data = Self.getData(this);
                    (_a = data.onShow) === null || _a === void 0 ? void 0 : _a.call(data);
                }
            }, onHide: function () {
                var _a;
                var data = Self.getData(this);
                (_a = data.onHide) === null || _a === void 0 ? void 0 : _a.call(data);
            }, onUnload: function () {
                var _a;
                var data = Self.getData(this);
                (_a = data.onUnload) === null || _a === void 0 ? void 0 : _a.call(data);
                Self.destory(this);
            } }, methods));
    };
    return MPPage;
}(base_1.default));
exports.default = MPPage;
