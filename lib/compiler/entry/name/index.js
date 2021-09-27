"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var EntryNameCache = /** @class */ (function () {
    function EntryNameCache() {
        this.context = '';
        this.packageDict = {};
        this.cache = {};
    }
    EntryNameCache.prototype.setContext = function (context) {
        this.context = context;
    };
    EntryNameCache.prototype.get = function (params) {
        var key = params.root || '';
        if (!this.cache[key]) {
            this.cache[key] = {};
        }
        if (!this.cache[key][params.path]) {
            var name_1 = path_1.default.join(params.root || '', params.component ? 'components' : '', path_1.default.relative(path_1.default.join(this.context, params.root || ''), params.path)
                .replace(/\.\.[\\/]/g, '@').replace(/\.[\\/]/g, '')).replace(/\.tsx$/, '.js');
            this.cache[key][params.path] = name_1;
            this.packageDict[name_1] = params.root;
        }
        return this.cache[key][params.path];
    };
    EntryNameCache.prototype.getPackage = function (name) {
        return this.packageDict[name];
    };
    return EntryNameCache;
}());
exports.default = EntryNameCache;
