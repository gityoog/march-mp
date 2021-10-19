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
const t = __importStar(require("@babel/types"));
const util_1 = require("../util");
class PropIdentifier {
    constructor({ path, scope, name }) {
        this.native = false;
        this.name = name;
        this.path = path;
        this.scope = scope;
        this.value = path.node;
        this.path.replaceWith((0, util_1.mergeMember)(t.identifier(name), scope));
    }
    setNative() {
        this.native = true;
    }
    restore() {
        this.path.replaceWith((0, util_1.genPropCall)(this.value, this.scope.length > 0 ? t.arrayExpression([t.stringLiteral(this.name), ...this.scope.map(key => t.identifier(key))]) : t.stringLiteral(this.name), this.native));
        this.name = null;
        this.path = null;
        this.scope = null;
        this.value = null;
    }
}
exports.default = PropIdentifier;
