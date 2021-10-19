"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModuleData {
    constructor(path) {
        this.path = path;
        this.json = {};
        this.wxml = '';
        this.wxss = '';
        this.wxs = '';
        this.children = {};
    }
    static Init(path) {
        const origin = this.map.get(path);
        if (origin) {
            origin.destory();
        }
        const data = new ModuleData(path);
        this.map.set(path, data);
        return data;
    }
    static Has(path) {
        return this.map.has(path);
    }
    static Pick(path) {
        const data = this.map.get(path);
        if (!data) {
            throw new Error('module data not exist: ' + path);
        }
        return data;
    }
    setJSON(json) {
        this.json = json;
    }
    setWXML(value) {
        this.wxml = value;
    }
    addWXSS(value) {
        this.wxss += value;
    }
    setWXSS(value) {
        this.wxss = value;
    }
    setWXS(value) {
        this.wxs = value;
    }
    setStatic(type, value) {
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
    }
    addChild(key, path) {
        this.children[key] = path;
    }
    getChildren() {
        return this.children;
    }
    destory() {
        this.children = null;
    }
}
exports.default = ModuleData;
ModuleData.map = new Map();
