"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = __importDefault(require("./map"));
const prop_1 = __importDefault(require("./prop"));
const event_1 = __importDefault(require("./event"));
const util_1 = require("./util");
class DependencyIdentifier {
    constructor(scope) {
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
    genName(type) {
        return this.prefix[type] + (this._id[type]++);
    }
    map(path) {
        const name = this.genName('prop');
        const calleeObject = path.get('callee.object');
        const scope = this.scope.getScope(calleeObject);
        this.data.push(new map_1.default({
            name, path, scope
        }));
        return scope;
    }
    prop(path) {
        const name = this.genName('prop');
        const scope = this.scope.getScope(path);
        const prop = new prop_1.default({
            name, path, scope
        });
        this.data.push(prop);
        return prop;
    }
    event(path) {
        const name = this.genName('event');
        const scope = (0, util_1.genExpression)(this.scope.getScope(path));
        this.data.push(new event_1.default({
            name, path, scope
        }));
        return {
            scope, name
        };
    }
    restore() {
        this.data.forEach(item => {
            item.restore();
        });
        this.data = [];
    }
    destroy() {
    }
}
exports.default = DependencyIdentifier;
