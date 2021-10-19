export default class EntryNameCache {
    private context;
    private packageDict;
    private cache;
    setContext(context: string): void;
    get(params: {
        path: string;
        root?: string;
        component?: boolean;
    }): string;
    getPackage(name: string): string | undefined;
}
