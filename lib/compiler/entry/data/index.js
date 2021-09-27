"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = __importDefault(require("../../module/data"));
var webpack_1 = __importDefault(require("webpack"));
var lodash_merge_1 = __importDefault(require("lodash.merge"));
var EntryData = /** @class */ (function () {
    function EntryData(_a) {
        var name = _a.name, path = _a.path, page = _a.page, components = _a.components;
        this.sourceCache = {};
        this.path = path;
        this.name = name;
        this.isPage = page;
        this.components = components;
        this.module = data_1.default.Pick(path);
    }
    EntryData.prototype.getSource = function (type, code) {
        var _a;
        if (((_a = this.sourceCache[type]) === null || _a === void 0 ? void 0 : _a.code) === code) {
            return this.sourceCache[type].source;
        }
        else {
            this.sourceCache[type] = {
                code: code,
                source: new webpack_1.default.sources.CachedSource(new webpack_1.default.sources.RawSource(code))
            };
            return this.sourceCache[type].source;
        }
    };
    EntryData.prototype.getUsingComponents = function () {
        var components = {};
        for (var name_1 in this.components) {
            components[name_1] = '/' + this.components[name_1].replace(/\.js$/, '').replace(/\\/g, '/');
        }
        return components;
    };
    EntryData.prototype.getJSON = function () {
        return JSON.stringify((0, lodash_merge_1.default)({}, this.module.json, {
            usingComponents: this.getUsingComponents(),
            component: this.isPage ? undefined : true
        }), null, 2);
    };
    EntryData.prototype.getFiles = function () {
        var files = [];
        var filename = this.name.replace(/\.js$/, '');
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
    };
    return EntryData;
}());
exports.default = EntryData;
