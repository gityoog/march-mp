"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = __importDefault(require("./map"));
var prop_1 = __importDefault(require("./prop"));
var event_1 = __importDefault(require("./event"));
var util_1 = require("./util");
var DependencyIdentifier = /** @class */ (function () {
    function DependencyIdentifier(scope) {
        this.scope = scope;
        this.prefix = {
            prop: 'p',
            event: 'e',
            scope: 's'
        };
        this._id = {
            prop: 0,
            event: 0,
            scope: 0
        };
        this.data = [];
    }
    DependencyIdentifier.prototype.genName = function (type) {
        return this.prefix[type] + (this._id[type]++);
    };
    DependencyIdentifier.prototype.map = function (path) {
        var name = this.genName('prop');
        var calleeObject = path.get('callee.object');
        var scope = this.scope.getScope(calleeObject);
        this.data.push(new map_1.default({
            name: name,
            path: path,
            scope: scope
        }));
        return scope;
    };
    DependencyIdentifier.prototype.prop = function (path) {
        var name = this.genName('prop');
        var scope = this.scope.getScope(path);
        var prop = new prop_1.default({
            name: name,
            path: path,
            scope: scope
        });
        this.data.push(prop);
        return prop;
    };
    DependencyIdentifier.prototype.event = function (path) {
        var name = this.genName('event');
        var scope = (0, util_1.genExpression)(this.scope.getScope(path));
        this.data.push(new event_1.default({
            name: name,
            path: path,
            scope: scope
        }));
        return {
            scope: scope,
            name: name
        };
    };
    DependencyIdentifier.prototype.restore = function () {
        this.data.forEach(function (item) {
            item.restore();
        });
        this.data = [];
    };
    DependencyIdentifier.prototype.destroy = function () {
    };
    return DependencyIdentifier;
}());
exports.default = DependencyIdentifier;
