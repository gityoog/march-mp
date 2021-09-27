"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = __importDefault(require("../../../module/data"));
function generateNodes(pages) {
    var dict = {};
    var getNode = function (path) {
        if (!dict[path]) {
            var node = {
                path: path,
                children: {},
                parent: []
            };
            dict[path] = node;
        }
        return dict[path];
    };
    var addRelation = function (node) {
        var children = data_1.default.Pick(node.path).getChildren();
        for (var key in children) {
            var child = getNode(children[key]);
            child.parent.push(node);
            node.children[key] = child;
            addRelation(child);
        }
    };
    pages.forEach(function (page) {
        addRelation(getNode(page.path));
    });
    return dict;
}
//todo 需要优化
function generateEntry(pages, getName) {
    var refs = generateNodes(pages);
    var packageSet = {};
    pages.forEach(function (page) {
        var set = packageSet[page.path] = new Set();
        set.add(page.root);
    });
    var getPackages = function (node) {
        if (!packageSet[node.path]) {
            var set_1 = packageSet[node.path] = new Set;
            node.parent.forEach(function (parent) {
                var packages = getPackages(parent);
                if (packages.has(undefined)) {
                    set_1.add(undefined);
                }
                else {
                    packages.forEach(function (value) {
                        set_1.add(value);
                    });
                }
            });
        }
        return packageSet[node.path];
    };
    var data = [];
    var dict = {};
    var getEntry = function (path, root) {
        var pack = packageSet[path].has(undefined) ? undefined : root;
        var rootEntry = dict[pack || ''] = dict[pack || ''] || {};
        if (!rootEntry[path]) {
            data.push(rootEntry[path] = {
                path: path,
                root: pack,
                page: false,
                name: '',
                components: {}
            });
        }
        return rootEntry[path];
    };
    var load = function (node) {
        var packages = getPackages(node);
        var entries = packages.has(undefined) ? [getEntry(node.path)] : __spreadArray([], __read(packages), false).map(function (root) { return getEntry(node.path, root); });
        var _loop_1 = function (key) {
            var child = node.children[key];
            load(child);
            entries.forEach(function (entry) {
                entry.components[key] = getEntry(child.path, entry.root);
            });
        };
        for (var key in node.children) {
            _loop_1(key);
        }
        return entries;
    };
    pages.forEach(function (page) {
        load(refs[page.path]).forEach(function (entry) {
            entry.page = true;
        });
    });
    data.forEach(function (item) {
        item.name = getName({
            path: item.path,
            root: item.root,
            component: !item.page
        });
    });
    refs = null;
    packageSet = null;
    dict = null;
    return data;
}
exports.default = generateEntry;
