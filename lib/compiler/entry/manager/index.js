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
    }
    addPage(path, root) {
        const name = this.nameCache.get({ path, root });
        this.pages.push({
            path, root
        });
        return name;
    }
    getRoot(name) {
        return this.nameCache.getPackage(name);
    }
    setContext(context) {
        this.nameCache.setContext(context);
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
