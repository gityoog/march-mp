import MPEntryPlugin from './entry/plugin';
import fixVue3This from './ts-transformer/fix-vue3-this';
declare const valueLoader: string;
declare const tsxLoader: string;
export { fixVue3This, valueLoader, tsxLoader };
export default MPEntryPlugin;
