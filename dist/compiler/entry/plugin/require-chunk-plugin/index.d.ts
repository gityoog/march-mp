import webpack from 'webpack';
type options = {
    calcPath: (entry: webpack.Chunk, chunk: webpack.Chunk) => string;
    addPath: (paths: string[]) => string;
};
export default class RequireChunkPlugin {
    private name;
    private options;
    constructor(options?: Partial<options>);
    apply(compiler: webpack.Compiler): void;
}
export {};
