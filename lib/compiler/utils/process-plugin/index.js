"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const single_line_log_1 = require("single-line-log");
class ProcessPlugin {
    constructor({ process = true } = {}) {
        this.name = 'ProcessPlugin';
        this.done = false;
        this.options = {
            process
        };
    }
    apply(compiler) {
        if (this.options.process) {
            new webpack_1.default.ProgressPlugin((percent, msg, module) => {
                !this.done && (0, single_line_log_1.stdout)((percent * 100).toFixed(0) + '% ' + msg + ' ' + (module || '') + '\n');
            }).apply(compiler);
        }
        compiler.hooks.compile.tap(this.name, () => {
            this.done = false;
            console.log('Building ...');
        });
        compiler.hooks.done.tap(this.name, stats => {
            this.done = true;
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
    }
}
exports.default = ProcessPlugin;
