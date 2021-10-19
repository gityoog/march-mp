export default class Diff {
    private data;
    private state;
    reset(): void;
    get(): Record<string, any> | undefined;
    add(key: string | string[], value: any, native?: boolean): void;
    destroy(): void;
    private getValue;
    private setValue;
    private deep;
}
