"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModuleData = /** @class */ (function () {
    function ModuleData(path) {
        this.path = path;
        this.json = {};
        this.wxml = '';
        this.wxss = '';
        this.wxs = '';
        this.children = {};
    }
    ModuleData.Init = function (path) {
        var origin = this.map.get(path);
        if (origin) {
            origin.destory();
        }
        var data = new ModuleData(path);
        this.map.set(path, data);
        return data;
    };
    ModuleData.Has = function (path) {
        return this.map.has(path);
    };
    ModuleData.Pick = function (path) {
        var data = this.map.get(path);
        if (!data) {
            throw new Error('module data not exist: ' + path);
        }
        return data;
    };
    ModuleData.prototype.setJSON = function (json) {
        this.json = json;
    };
    ModuleData.prototype.setWXML = function (value) {
        this.wxml = value;
    };
    ModuleData.prototype.addWXSS = function (value) {
        this.wxss += value;
    };
    ModuleData.prototype.setWXSS = function (value) {
        this.wxss = value;
    };
    ModuleData.prototype.setWXS = function (value) {
        this.wxs = value;
    };
    ModuleData.prototype.setStatic = function (type, value) {
        switch (type) {
            case 'wxss':
                return this.setWXSS(value);
            case 'wxml':
                return this.setWXML(value);
            case 'wxs':
                return this.setWXS(value);
            case 'json':
                return this.setJSON(JSON.parse(value));
        }
    };
    ModuleData.prototype.addChild = function (key, path) {
        this.children[key] = path;
    };
    ModuleData.prototype.getChildren = function () {
        return this.children;
    };
    ModuleData.prototype.destory = function () {
        this.children = null;
    };
    ModuleData.map = new Map();
    return ModuleData;
}());
exports.default = ModuleData;
