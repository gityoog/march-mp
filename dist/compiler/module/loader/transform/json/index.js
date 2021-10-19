"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = __importDefault(require("@babel/generator"));
function getJSON(path) {
    const json = path.get('body.body').find(item => {
        if (item.isClassProperty()) {
            const key = item.get('key');
            if (key.isIdentifier()) {
                return key.node.name === '$json';
            }
        }
        return false;
    });
    if (json) {
        const node = json.get('value').node;
        if (node) {
            return eval(`(${(0, generator_1.default)(node, { comments: false }).code})`);
        }
        json.remove();
    }
}
exports.default = getJSON;
