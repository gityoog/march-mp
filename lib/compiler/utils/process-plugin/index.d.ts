import webpack from 'webpack';
export default class ProcessPlugin {
    private options;
    constructor({ process }?: {
        process?: boolean;
    });
    private name;
    private done;
    apply(compiler: webpack.Compiler): void;
}
