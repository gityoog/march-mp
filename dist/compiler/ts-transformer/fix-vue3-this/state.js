"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const util_1 = require("../util");
class FixThisState {
    constructor() {
        this.arrowCount = 0;
        this.data = [];
    }
    get identifier() {
        if (this._identifier) {
            return this._identifier;
        }
        else {
            return this._identifier = typescript_1.default.factory.createUniqueName('reactive');
        }
    }
    isChanged() {
        return this._identifier !== undefined;
    }
    isInArrow() {
        return this.arrowCount > 0;
    }
    enterArrow() {
        this.arrowCount++;
    }
    leaveArrow() {
        this.arrowCount--;
    }
    add(node) {
        this.data.unshift({
            node, status: 0
        });
    }
    getLast() {
        return this.data[0];
    }
    removeLast() {
        this.data.splice(0, 1);
    }
    isActived() {
        var _a;
        return ((_a = this.getLast()) === null || _a === void 0 ? void 0 : _a.status) === 1;
    }
    active(node) {
        const item = this.getLast();
        if ((item === null || item === void 0 ? void 0 : item.node) === node) {
            // console.log('actived', toCode(node))
            item.status = 1;
        }
    }
    leave(node) {
        var _a;
        if (((_a = this.getLast()) === null || _a === void 0 ? void 0 : _a.node) === node) {
            this.removeLast();
        }
    }
    log() {
        console.log('------------');
        this.data.forEach(item => {
            console.log((0, util_1.toCode)(item.node));
        });
        console.log('------------');
    }
}
exports.default = FixThisState;
