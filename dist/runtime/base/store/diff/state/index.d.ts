type result = {
    dict: Record<string, data> | null;
    children: data[] | null;
};
type data = {
    name: string;
    path: string;
    length: number;
} & result;
export default class DiffState {
    data: data[];
    dict: Record<string, data>;
    add(keys: string | string[]): void;
    get(): {
        name: string;
        path: string[];
    }[];
    reset(): void;
    destroy(): void;
}
export {};
