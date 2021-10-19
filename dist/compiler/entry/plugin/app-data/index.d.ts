/// <reference types="node" />
import webpack from 'webpack';
export default class AppData {
    name: string;
    path: string;
    context: string;
    source: webpack.sources.Source | null;
    setContext(context: string): void;
    private ignorePattern;
    setIgnore(data?: Array<string | RegExp>): void;
    private ignore;
    private entries;
    private content;
    private roots;
    private independents;
    private update;
    getEntries(content: string | Buffer): {
        root?: string | undefined;
        path: string;
        independent?: boolean | undefined;
    }[];
    getRoots(): string[];
    isIndependent(root: string): boolean;
}
