import EntryData from '../data';
declare type oldData = {
    path: string;
    name: string;
};
export default class EntryManager {
    data: EntryData[];
    private nameCache;
    private pages;
    private loaded;
    loadOld(callback: (item: oldData) => void): void;
    needLoad(data: EntryData): boolean;
    addPage(path: string, root?: string, independent?: boolean): string;
    getRoot(name: string): string | undefined;
    setContext(context: string): void;
    getNotUsed(): string[];
    generate(): void;
    clear(): void;
}
export {};
