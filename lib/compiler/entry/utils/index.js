"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEntryName = void 0;
const path_1 = __importDefault(require("path"));
function genEntryName({ root, path, context, component = false }) {
    return path_1.default.join(root || '', component ? 'components' : '', path_1.default.relative(path_1.default.resolve(context, root || ''), path)
        .replace(/\.\.[\\/]/g, '@').replace(/\.[\\/]/g, '')).replace(/\.tsx$/, '.js');
}
exports.genEntryName = genEntryName;
