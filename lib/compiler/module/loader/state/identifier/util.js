"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEventCall = exports.genPropCall = exports.fnName = exports.genExpression = exports.mergeMember = void 0;
const t = __importStar(require("@babel/types"));
function mergeMember(identifier, indexs) {
    let node = identifier;
    indexs.forEach(index => {
        node = t.memberExpression(node, t.identifier(index), true);
    });
    return node;
}
exports.mergeMember = mergeMember;
function genExpression(indexs) {
    let property = undefined;
    for (const index of indexs) {
        if (!property) {
            property = t.identifier(index);
        }
        else {
            property = t.binaryExpression('+', t.binaryExpression('+', property, t.stringLiteral('_')), t.identifier(index));
        }
    }
    return property;
}
exports.genExpression = genExpression;
exports.fnName = {
    prop: '_$p',
    event: '_$e'
};
function genPropCall(value, name, native) {
    return t.callExpression(t.identifier(exports.fnName.prop), [
        value,
        name
    ].concat(native ? t.booleanLiteral(true) : []));
}
exports.genPropCall = genPropCall;
function genEventCall(value, name) {
    return t.callExpression(t.identifier(exports.fnName.event), [
        value,
        name
    ]);
}
exports.genEventCall = genEventCall;
