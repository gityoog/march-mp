"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = __importDefault(require("typescript"));
var util_1 = require("../util");
var FixThisState = /** @class */ (function () {
    function FixThisState() {
        this.arrowCount = 0;
        this.data = [];
    }
    Object.defineProperty(FixThisState.prototype, "identifier", {
        get: function () {
            if (this._identifier) {
                return this._identifier;
            }
            else {
                return this._identifier = typescript_1.default.factory.createUniqueName('reactive');
            }
        },
        enumerable: false,
        configurable: true
    });
    FixThisState.prototype.isChanged = function () {
        return this._identifier !== undefined;
    };
    FixThisState.prototype.isInArrow = function () {
        return this.arrowCount > 0;
    };
    FixThisState.prototype.enterArrow = function () {
        this.arrowCount++;
    };
    FixThisState.prototype.leaveArrow = function () {
        this.arrowCount--;
    };
    FixThisState.prototype.add = function (node) {
        this.data.unshift({
            node: node,
            status: 0
        });
    };
    FixThisState.prototype.getLast = function () {
        return this.data[0];
    };
    FixThisState.prototype.removeLast = function () {
        this.data.splice(0, 1);
    };
    FixThisState.prototype.isActived = function () {
        var _a;
        return ((_a = this.getLast()) === null || _a === void 0 ? void 0 : _a.status) === 1;
    };
    FixThisState.prototype.active = function (node) {
        var item = this.getLast();
        if ((item === null || item === void 0 ? void 0 : item.node) === node) {
            // console.log('actived', toCode(node))
            item.status = 1;
        }
    };
    FixThisState.prototype.leave = function (node) {
        var _a;
        if (((_a = this.getLast()) === null || _a === void 0 ? void 0 : _a.node) === node) {
            this.removeLast();
        }
    };
    FixThisState.prototype.log = function () {
        console.log('------------');
        this.data.forEach(function (item) {
            console.log((0, util_1.toCode)(item.node));
        });
        console.log('------------');
    };
    return FixThisState;
}());
exports.default = FixThisState;
