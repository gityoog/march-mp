"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
class EntryNameCache {
    constructor() {
        this.context = '';
        this.packageDict = {};
        this.cache = {};
    }
    setContext(context) {
        this.context = context;
    }
    get(params) {
        const key = params.root || '';
        if (!this.cache[key]) {
            this.cache[key] = {};
        }
        if (!this.cache[key][params.path]) {
            const name = path_1.default.join(params.root || '', params.component ? 'components' : '', path_1.default.relative(path_1.default.join(this.context, params.root || ''), params.path)
                .replace(/\.\.[\\/]/g, '@').replace(/\.[\\/]/g, '')).replace(/\.tsx$/, '.js');
            this.cache[key][params.path] = name;
            this.packageDict[name] = params.root;
        }
        return this.cache[key][params.path];
    }
    getPackage(name) {
        return this.packageDict[name];
    }
}
exports.default = EntryNameCache;
