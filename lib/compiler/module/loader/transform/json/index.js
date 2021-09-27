"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generator_1 = require("@babel/generator");
function getJSON(path) {
    var json = path.get('body.body').find(function (item) {
        if (item.isClassProperty()) {
            var key = item.get('key');
            if (key.isIdentifier()) {
                return key.node.name === '$json';
            }
        }
        return false;
    });
    if (json) {
        var node = json.get('value').node;
        if (node) {
            return eval("(" + (0, generator_1.default)(node, { comments: false }).code + ")");
        }
        json.remove();
    }
}
exports.default = getJSON;
