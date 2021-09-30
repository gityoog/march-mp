import EntryData from '../data';
declare type oldData = {
    path: string;
    name: string;
};
export default class EntryManager {
    data: EntryData[];
    private nameCache;
    private pages;
    private oldComponents;
    private oldDict;
    load(callback: (item: oldData) => void): void;
    needLoad(data: EntryData): false;
    addPage(path: string, root?: string): string;
    getRoot(name: string): string | undefined;
    setContext(context: string): void;
    generate(): void;
    complete(): void;
    clear(): void;
}
export {};
