"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("@babel/types");
var util_1 = require("../util");
var EventIdentifier = /** @class */ (function () {
    function EventIdentifier(_a) {
        var path = _a.path, scope = _a.scope, name = _a.name;
        this.name = name;
        this.path = path;
        this.value = path.node;
        this.scope = scope;
        this.path.replaceWith(t.stringLiteral(name));
    }
    EventIdentifier.prototype.restore = function () {
        this.path.replaceWith((0, util_1.genEventCall)(this.value, this.scope ? t.arrayExpression([t.stringLiteral(this.name), this.scope]) : t.stringLiteral(this.name)));
        this.name = null;
        this.path = null;
        this.scope = null;
        this.value = null;
    };
    return EventIdentifier;
}());
exports.default = EventIdentifier;
