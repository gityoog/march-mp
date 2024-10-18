interface Reactivity {
    reactive<T extends object>(data: T): T;
    effect(callback: (pause: () => void, resume: () => void) => void): () => void;
    toRaw<T>(data: T): T;
    markRaw<T extends object>(data: T): T;
}
declare const Reactivity: {
    use(type: 'proxy' | 'define'): void;
    reactive<T extends object>(data: T): T;
    effect(callback: (pause: () => void, resume: () => void) => void): () => void;
    toRaw<T_1>(data: T_1): T_1;
    markRaw<T_2 extends object>(data: T_2): T_2;
};
export default Reactivity;
