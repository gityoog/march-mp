"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
class AppData {
    constructor() {
        this.name = 'app.json';
        this.path = '';
        this.context = '';
        this.source = null;
        this.ignorePattern = [];
        this.entries = [];
        this.content = '';
    }
    setContext(context) {
        this.context = context;
        this.path = path_1.default.resolve(context, this.name);
    }
    setIgnore(data) {
        this.ignorePattern = data || [];
    }
    ignore(page) {
        return this.ignorePattern.some(item => {
            if (typeof item === 'string') {
                return page === item;
            }
            else {
                return item.test(page);
            }
        });
    }
    update() {
        var _a, _b, _c, _d;
        this.entries = [];
        const data = JSON.parse(this.content);
        if (this.ignorePattern.length > 0) {
            data.pages = (_a = data.pages) === null || _a === void 0 ? void 0 : _a.filter(page => !this.ignore(page));
            (_b = data.subpackages) === null || _b === void 0 ? void 0 : _b.forEach(({ root, pages }) => {
                pages = pages.filter(page => !this.ignore(root + '/' + page));
            });
        }
        (_c = data.pages) === null || _c === void 0 ? void 0 : _c.forEach(item => {
            this.entries.push({
                path: path_1.default.resolve(this.context, item + '.tsx')
            });
        });
        (_d = data.subpackages) === null || _d === void 0 ? void 0 : _d.forEach(({ root, pages }) => {
            pages.forEach(item => {
                this.entries.push({
                    root,
                    path: path_1.default.resolve(this.context, root, item + '.tsx')
                });
            });
        });
    }
    getEntries(content) {
        if (typeof content !== 'string') {
            content = content.toString();
        }
        if (this.content !== content) {
            this.content = content;
            this.source = new webpack_1.default.sources.CachedSource(new webpack_1.default.sources.RawSource(JSON.stringify(this.content, null, 2)));
            this.update();
        }
        return this.entries;
    }
}
exports.default = AppData;
