export const ITERATE_KEY: unique symbol;
export function computed(getterOrOptions: any): {
    __v_isRef: boolean;
    effect: {
        (...args: any[]): any;
        id: number;
        _isEffect: boolean;
        active: boolean;
        raw: any;
        deps: any[];
        options: any;
    };
    value: any;
};
export function customRef(factory: any): {
    __v_isRef: boolean;
    value: any;
};
export function effect(fn: any, options?: Readonly<{}>): {
    (...args: any[]): any;
    id: number;
    _isEffect: boolean;
    active: boolean;
    raw: any;
    deps: any[];
    options: any;
};
export function enableTracking(): void;
export function isProxy(value: any): any;
export function isReactive(value: any): any;
export function isReadonly(value: any): boolean;
export function isRef(r: any): boolean;
export function markRaw(value: any): any;
export function pauseTracking(): void;
export function reactive(target: any): any;
export function readonly(target: any): any;
export function ref(value: any): any;
export function resetTracking(): void;
export function shallowReactive(target: any): any;
export function shallowReadonly(target: any): any;
export function shallowRef(value: any): any;
export function stop(effect: any): void;
export function toRaw(observed: any): any;
export function toRef(object: any, key: any): {
    __v_isRef: boolean;
    value: any;
};
export function toRefs(object: any): {};
export function track(target: any, type: any, key: any): void;
export function trigger(target: any, type: any, key: any, newValue: any, oldValue: any, oldTarget: any): void;
export function triggerRef(ref: any): void;
export function unref(ref: any): any;
