"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
class EventIdentifier {
    constructor({ path, scope, name }) {
        this.name = name;
        this.path = path;
        this.value = path.node;
        this.scope = scope;
        this.path.replaceWith(t.stringLiteral(name));
    }
    restore() {
        this.path.replaceWith((0, util_1.genEventCall)(this.value, this.scope ? t.arrayExpression([t.stringLiteral(this.name), this.scope]) : t.stringLiteral(this.name)));
        this.name = null;
        this.path = null;
        this.scope = null;
        this.value = null;
    }
}
exports.default = EventIdentifier;
