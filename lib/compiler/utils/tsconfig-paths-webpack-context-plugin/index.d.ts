import Webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
declare type options = NonNullable<ConstructorParameters<typeof TsconfigPathsPlugin>[0]>;
export default class TsconfigPathsWebpackContextPlugin {
    options: options;
    constructor(rawOptions?: options);
    apply(compiler: Webpack.Compiler): void;
}
export {};
