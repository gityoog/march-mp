import webpack from 'webpack';
export default class MPEntryPlugin {
    private options;
    private name;
    private manager;
    private app;
    constructor(options?: {
        ignore?: Array<string | RegExp>;
    });
    apply(compiler: webpack.Compiler): void;
}
