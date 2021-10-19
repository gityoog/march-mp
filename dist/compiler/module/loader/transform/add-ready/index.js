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
// 通过给顶层代码添加条件表达式保证第一个元素拥有wx:if="{{ p0 }}"作为初始化状态
function addReady(path) {
    if (path.isLogicalExpression()) {
        // a && <div></div> -> 不变
        // a || <div></div> -> (true && !a) && <div></div>
        if (path.node.operator === '||') {
            path.replaceWith(t.logicalExpression('&&', t.logicalExpression('&&', t.booleanLiteral(true), t.unaryExpression('!', path.node.left)), path.node.right));
        }
    }
    else if (path.isConditionalExpression()) {
        // a ? <div></div> : <div></div> -> 不变
    }
    else {
        path.replaceWith(t.logicalExpression('&&', t.booleanLiteral(true), path.node));
    }
}
exports.default = addReady;
