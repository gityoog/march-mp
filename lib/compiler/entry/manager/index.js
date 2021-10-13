"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../data"));
const name_1 = __importDefault(require("../name"));
const generate_1 = __importDefault(require("./generate"));
class EntryManager {
    constructor() {
        this.data = [];
        this.nameCache = new name_1.default;
        this.pages = [];
        this.loaded = new Set();
    }
    loadOld(callback) {
        this.loaded.clear();
        this.data
            .filter(item => !item.isPage)
            .forEach(item => {
            this.loaded.add(item.name);
            callback({
                path: item.path,
                name: item.name
            });
        });
        this.clear();
    }
    needLoad(data) {
        return !data.isPage && !this.loaded.has(data.name);
    }
    addPage(path, root, independent) {
        const name = this.nameCache.get({ path, root });
        this.pages.push({
            path, root, independent
        });
        return name;
    }
    getRoot(name) {
        return this.nameCache.getPackage(name);
    }
    setContext(context) {
        this.nameCache.setContext(context);
    }
    getNotUsed() {
        const used = new Set(this.data.map(item => item.name));
        const notUsed = [];
        this.loaded.forEach(name => {
            if (!used.has(name)) {
                notUsed.push(name);
            }
        });
        return notUsed;
    }
    generate() {
        this.data = (0, generate_1.default)(this.pages, (params) => {
            return this.nameCache.get(params);
        })
            .map(entry => {
            const components = {};
            for (const key in entry.components) {
                components[key] = entry.components[key].name;
            }
            return new data_1.default({
                name: entry.name,
                path: entry.path,
                page: entry.page,
                components
            });
        });
    }
    clear() {
        this.pages = [];
        this.data = [];
    }
}
exports.default = EntryManager;
