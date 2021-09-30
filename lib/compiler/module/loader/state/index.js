"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const identifier_1 = __importDefault(require("./identifier"));
const map_scope_1 = __importDefault(require("./map-scope"));
class State {
    constructor(filename) {
        this.debug = false;
        this.json = {};
        this.cssfile = [];
        this.wxml = '';
        this.components = {};
        this.callbacks = [];
        this.events = [];
        this.mapScope = new map_scope_1.default();
        this.identifier = new identifier_1.default(this.mapScope);
        this.warning = [];
    }
    setWXML(value) {
        this.wxml = value;
    }
    setJSON(value) {
        this.json = value;
    }
    addCss(file) {
        this.cssfile.push(file);
    }
    addComponent(name, path) {
        this.components[name] = this.components[name] || {
            path,
            props: []
        };
    }
    setComponentNative(name) {
        this.components[name].props.forEach(prop => {
            prop.setNative();
        });
    }
    before(callback) {
        this.callbacks.push(callback);
    }
    setGenerator(generator) {
        this.generator = generator;
    }
    generate() {
        var _a;
        this.identifier.restore();
        this.callbacks.forEach(fn => fn());
        return ((_a = this.generator) === null || _a === void 0 ? void 0 : _a.call(this)) || '';
    }
    addEvent(name) {
        this.events.push(name);
    }
    enterMap(path, scope) {
        this.mapScope.enter(path, scope);
    }
    exitMap() {
        this.mapScope.exit();
    }
    genMap(path) {
        return this.identifier.map(path);
    }
    genProp(path, component) {
        path.skip();
        const prop = this.identifier.prop(path);
        if (component) {
            this.components[component].props.push(prop);
        }
    }
    genEvent(path) {
        path.skip();
        const { scope, name } = this.identifier.event(path);
        this.events.push(name);
        return { scope, name };
    }
    addWarning(warn) {
        this.warning.push(warn);
    }
    destroy() {
        this.mapScope.destroy();
        this.identifier.destroy();
        this.json = null;
        this.events = null;
        this.callbacks = null;
        this.generator = null;
        this.components = null;
        this.warning = null;
        this.cssfile = null;
    }
}
exports.default = State;
