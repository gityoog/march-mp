import webpack from 'webpack';
export default class SplitPackagePlugin {
    private options;
    name: string;
    constructor(options: {
        getRoot(name: string): string | undefined;
        getRoots(): string[];
        isIndependent(name: string): boolean;
    });
    packages: any[];
    apply(compiler: webpack.Compiler): void;
}
