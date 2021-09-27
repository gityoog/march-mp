import webpack from 'webpack';
export default class MPEntryPlugin {
    private options;
    private name;
    private manager;
    constructor(options?: {
        ignore?: Array<string | RegExp>;
    });
    private ignore;
    apply(compiler: webpack.Compiler): void;
}
