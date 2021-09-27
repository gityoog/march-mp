import ModuleData from "../../module/data";
import webpack from 'webpack';
export default class EntryData {
    name: string;
    isPage: boolean;
    components: Record<string, string>;
    module: ModuleData;
    path: string;
    private sourceCache;
    private getSource;
    constructor({ name, path, page, components }: {
        name: string;
        path: string;
        page: boolean;
        components: Record<string, string>;
    });
    private getUsingComponents;
    private getJSON;
    getFiles(): {
        file: string;
        source: webpack.sources.Source;
    }[];
}
