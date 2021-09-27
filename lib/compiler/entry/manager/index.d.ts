import EntryData from '../data';
export default class EntryManager {
    data: EntryData[];
    private nameCache;
    private pages;
    addPage(path: string, root?: string): string;
    getRoot(name: string): string | undefined;
    setContext(context: string): void;
    generate(): void;
    clear(): void;
}
