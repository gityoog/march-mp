import webpack from 'webpack';
export default class SplitPackagePlugin {
    private options;
    name: string;
    constructor(options: {
        getRoot(name: string): string | undefined;
    });
    apply(compiler: webpack.Compiler): void;
}
