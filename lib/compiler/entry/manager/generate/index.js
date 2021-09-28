"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../../../module/data"));
function generateNodes(pages) {
    const dict = {};
    const getNode = (path) => {
        if (!dict[path]) {
            const node = {
                path,
                children: {},
                parent: []
            };
            dict[path] = node;
        }
        return dict[path];
    };
    const addRelation = (node) => {
        const children = data_1.default.Pick(node.path).getChildren();
        for (const key in children) {
            const child = getNode(children[key]);
            child.parent.push(node);
            node.children[key] = child;
            addRelation(child);
        }
    };
    pages.forEach(page => {
        addRelation(getNode(page.path));
    });
    return dict;
}
//todo 需要优化
function generateEntry(pages, getName) {
    let refs = generateNodes(pages);
    let packageSet = {};
    pages.forEach(page => {
        const set = packageSet[page.path] = new Set();
        set.add(page.root);
    });
    const getPackages = (node) => {
        if (!packageSet[node.path]) {
            const set = packageSet[node.path] = new Set;
            node.parent.forEach(parent => {
                const packages = getPackages(parent);
                if (packages.has(undefined)) {
                    set.add(undefined);
                }
                else {
                    packages.forEach(value => {
                        set.add(value);
                    });
                }
            });
        }
        return packageSet[node.path];
    };
    const data = [];
    let dict = {};
    const getEntry = (path, root) => {
        const pack = packageSet[path].has(undefined) ? undefined : root;
        const rootEntry = dict[pack || ''] = dict[pack || ''] || {};
        if (!rootEntry[path]) {
            data.push(rootEntry[path] = {
                path,
                root: pack,
                page: false,
                name: '',
                components: {}
            });
        }
        return rootEntry[path];
    };
    const load = (node) => {
        const packages = getPackages(node);
        const entries = packages.has(undefined) ? [getEntry(node.path)] : [...packages].map(root => getEntry(node.path, root));
        for (const key in node.children) {
            const child = node.children[key];
            load(child);
            entries.forEach(entry => {
                entry.components[key] = getEntry(child.path, entry.root);
            });
        }
        return entries;
    };
    pages.forEach(page => {
        load(refs[page.path]).forEach(entry => {
            entry.page = true;
        });
    });
    data.forEach(item => {
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
