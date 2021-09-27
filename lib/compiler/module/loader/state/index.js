"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var identifier_1 = __importDefault(require("./identifier"));
var map_scope_1 = __importDefault(require("./map-scope"));
var State = /** @class */ (function () {
    function State(filename) {
        this.debug = false;
        this.json = {};
        this.cssfile = [];
        this.wxml = '';
        this.components = {};
        this.callbacks = [];
        this.events = [];
        this.mapScope = new map_scope_1.default();
        this.identifier = new identifier_1.default(this.mapScope);
        // this.debug = filename === 'D:\\desktop\\smart-webpack\\src\\miniprogram\\project\\康居集团工地长制智慧巡查系统\\pages\\index\\index.tsx'
    }
    State.prototype.setWXML = function (value) {
        this.wxml = value;
    };
    State.prototype.setJSON = function (value) {
        this.json = value;
    };
    State.prototype.addCss = function (file) {
        this.cssfile.push(file);
    };
    State.prototype.addComponent = function (name, path) {
        this.components[name] = this.components[name] || {
            path: path,
            props: []
        };
    };
    State.prototype.setComponentNative = function (name) {
        this.components[name].props.forEach(function (prop) {
            prop.setNative();
        });
    };
    State.prototype.before = function (callback) {
        this.callbacks.push(callback);
    };
    State.prototype.setGenerator = function (generator) {
        this.generator = generator;
    };
    State.prototype.generate = function () {
        var _a;
        this.identifier.restore();
        this.callbacks.forEach(function (fn) { return fn(); });
        return ((_a = this.generator) === null || _a === void 0 ? void 0 : _a.call(this)) || '';
    };
    State.prototype.addEvent = function (name) {
        this.events.push(name);
    };
    State.prototype.enterMap = function (path, scope) {
        this.mapScope.enter(path, scope);
    };
    State.prototype.exitMap = function () {
        this.mapScope.exit();
    };
    State.prototype.genMap = function (path) {
        return this.identifier.map(path);
    };
    State.prototype.genProp = function (path, component) {
        path.skip();
        var prop = this.identifier.prop(path);
        if (component) {
            this.components[component].props.push(prop);
        }
    };
    State.prototype.genEvent = function (path) {
        path.skip();
        var _a = this.identifier.event(path), scope = _a.scope, name = _a.name;
        this.events.push(name);
        return { scope: scope, name: name };
    };
    State.prototype.destroy = function () {
        this.mapScope.destroy();
        this.identifier.destroy();
        this.json = null;
        this.events = null;
        this.callbacks = null;
        this.generator = null;
        this.components = null;
        this.cssfile = null;
    };
    return State;
}());
exports.default = State;
