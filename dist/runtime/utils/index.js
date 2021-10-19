"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.originMPData = exports.isMPDataReady = exports.initMPData = exports.buildMPData = void 0;
var originKey = '__origin__fn';
function buildMPData(object) {
    var _a;
    var result = (_a = {},
        _a[originKey] = function () { return object; },
        _a);
    return result;
}
exports.buildMPData = buildMPData;
function initMPData(object) {
    if (isObject(object)) {
        var fn = Reflect.get(object, originKey);
        if (!fn) {
            Reflect.set(object, originKey, function () { return object; });
            return true;
        }
    }
    return false;
}
exports.initMPData = initMPData;
function isMPDataReady(object) {
    if (isObject(object)) {
        var originFn = Reflect.get(object, originKey);
        if (originFn) {
            return true;
        }
        else {
            return false;
        }
    }
    return true;
}
exports.isMPDataReady = isMPDataReady;
function originMPData(object, info, other) {
    if (isObject(object)) {
        var originFn = Reflect.get(object, originKey);
        if (originFn) {
            return originFn();
        }
        else {
            console.warn('----unset origin data----', info, object, other);
        }
    }
    return object;
}
exports.originMPData = originMPData;
function isObject(data) {
    return typeof data === 'object' && data !== null && !Array.isArray(data);
}
