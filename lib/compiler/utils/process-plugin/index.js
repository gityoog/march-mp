"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importDefault(require("webpack"));
var single_line_log_1 = require("single-line-log");
var ProcessPlugin = /** @class */ (function () {
    function ProcessPlugin(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.process, process = _c === void 0 ? true : _c;
        this.name = 'ProcessPlugin';
        this.options = {
            process: process
        };
    }
    ProcessPlugin.prototype.apply = function (compiler) {
        if (this.options.process) {
            new webpack_1.default.ProgressPlugin(function (percent, msg, module) {
                (0, single_line_log_1.stdout)((percent * 100).toFixed(0) + '% ' + msg + ' ' + (module || '') + '\n');
            }).apply(compiler);
        }
        compiler.hooks.compile.tap(this.name, function () {
            console.log('Building ...');
        });
        compiler.hooks.done.tap(this.name, function (stats) {
            if (stats.hasErrors()) {
                console.log(stats.toString({
                    all: false,
                    errors: true,
                    colors: true
                }));
                console.log('Build failed with errors.');
            }
            else {
                if (stats.hasWarnings()) {
                    console.log('Build success with warnings.');
                    console.log(stats.toString({
                        all: false,
                        errors: true,
                        warnings: true,
                        colors: true
                    }));
                }
                console.log('Build success. Time:', stats.toJson().time, 'ms');
            }
        });
    };
    return ProcessPlugin;
}());
exports.default = ProcessPlugin;
