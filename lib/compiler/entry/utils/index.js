"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEntryName = void 0;
var path_1 = __importDefault(require("path"));
function genEntryName(_a) {
    var root = _a.root, path = _a.path, context = _a.context, _b = _a.component, component = _b === void 0 ? false : _b;
    return path_1.default.join(root || '', component ? 'components' : '', path_1.default.relative(path_1.default.resolve(context, root || ''), path)
        .replace(/\.\.[\\/]/g, '@').replace(/\.[\\/]/g, '')).replace(/\.tsx$/, '.js');
}
exports.genEntryName = genEntryName;
