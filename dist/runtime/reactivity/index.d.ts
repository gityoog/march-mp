interface Reactivity {
    reactive<T extends object>(data: T): T;
    effect(callback: (pause: () => void, resume: () => void) => void): () => void;
    toRaw<T>(data: T): T;
    markRaw<T extends object>(data: T): T;
    set<T extends object, K extends keyof T>(data: T, key: K, value: T[K]): void;
}
declare const Reactivity: {
    use(type: 'proxy' | 'define'): void;
    reactive<T extends object>(data: T): T;
    effect(callback: (pause: () => void, resume: () => void) => void): () => void;
    toRaw<T_1>(data: T_1): T_1;
    markRaw<T_2 extends object>(data: T_2): T_2;
    set<T_3 extends object, K extends keyof T_3>(data: T_3, key: K, value: T_3[K]): void;
};
export default Reactivity;
