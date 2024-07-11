"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../../module/data"));
const webpack_1 = __importDefault(require("webpack"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
class EntryData {
    getSource(type, code) {
        var _a;
        if (((_a = this.sourceCache[type]) === null || _a === void 0 ? void 0 : _a.code) === code) {
            return this.sourceCache[type].source;
        }
        else {
            this.sourceCache[type] = {
                code,
                source: new webpack_1.default.sources.CachedSource(new webpack_1.default.sources.RawSource(code))
            };
            return this.sourceCache[type].source;
        }
    }
    constructor({ name, path, page, components }) {
        this.sourceCache = {};
        this.path = path;
        this.name = name;
        this.isPage = page;
        this.components = components;
        this.module = data_1.default.Pick(path);
    }
    getUsingComponents() {
        const components = {};
        for (const name in this.components) {
            components[name] = '/' + this.components[name].replace(/\.js$/, '').replace(/\\/g, '/');
        }
        return components;
    }
    getJSON() {
        return JSON.stringify((0, lodash_merge_1.default)({}, this.module.json, {
            usingComponents: this.getUsingComponents(),
            component: this.isPage ? undefined : true
        }), null, 2);
    }
    getFiles() {
        const files = [];
        const filename = this.name.replace(/\.js$/, '');
        files.push({
            file: filename + '.wxml',
            source: this.getSource('wxml', this.module.wxml)
        });
        files.push({
            file: filename + '.json',
            source: this.getSource('json', this.getJSON())
        });
        if (this.module.wxss) {
            files.push({
                file: filename + '.wxss',
                source: this.getSource('wxss', this.module.wxss)
            });
        }
        if (this.module.wxs) {
            files.push({
                file: filename + '.wxs',
                source: this.getSource('wxs', this.module.wxs)
            });
        }
        return files;
    }
}
exports.default = EntryData;
