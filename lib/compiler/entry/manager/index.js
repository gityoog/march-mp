"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../data");
var name_1 = require("../name");
var generate_1 = require("./generate");
var EntryManager = /** @class */ (function () {
    function EntryManager() {
        this.data = [];
        this.nameCache = new name_1.default;
        this.pages = [];
    }
    EntryManager.prototype.addPage = function (path, root) {
        var name = this.nameCache.get({ path: path, root: root });
        this.pages.push({
            path: path,
            root: root
        });
        return name;
    };
    EntryManager.prototype.getRoot = function (name) {
        return this.nameCache.getPackage(name);
    };
    EntryManager.prototype.setContext = function (context) {
        this.nameCache.setContext(context);
    };
    EntryManager.prototype.generate = function () {
        var _this = this;
        this.data = (0, generate_1.default)(this.pages, function (params) {
            return _this.nameCache.get(params);
        })
            .map(function (entry) {
            var components = {};
            for (var key in entry.components) {
                components[key] = entry.components[key].name;
            }
            return new data_1.default({
                name: entry.name,
                path: entry.path,
                page: entry.page,
                components: components
            });
        });
    };
    EntryManager.prototype.clear = function () {
        this.pages = [];
        this.data = [];
    };
    return EntryManager;
}());
exports.default = EntryManager;
