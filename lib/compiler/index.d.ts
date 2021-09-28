import MPEntryPlugin from './entry/plugin';
import ProcessPlugin from './utils/process-plugin';
import fixVue3This from './utils/ts-transformer/fix-vue3-this';
import TsconfigPathsWebpackContextPlugin from './utils/tsconfig-paths-webpack-context-plugin';
declare const valueLoader: string;
declare const tsxLoader: string;
export { ProcessPlugin, fixVue3This, TsconfigPathsWebpackContextPlugin, valueLoader, tsxLoader };
export default MPEntryPlugin;
