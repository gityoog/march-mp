import Webpack from 'webpack';
export default class ProcessPlugin {
    private options;
    constructor({ process }?: {
        process?: boolean;
    });
    private name;
    apply(compiler: Webpack.Compiler): void;
}
