declare const ITERATE_KEY: unique symbol;
declare function effect(fn: any, options?: Readonly<{}>): {
    (...args: any[]): any;
    id: number;
    _isEffect: boolean;
    active: boolean;
    raw: any;
    deps: any[];
    options: any;
};
declare function stop(effect: any): void;
declare function pauseTracking(): void;
declare function enableTracking(): void;
declare function resetTracking(): void;
declare function track(target: any, type: any, key: any): void;
declare function trigger(target: any, type: any, key: any, newValue: any, oldValue: any, oldTarget: any): void;
declare function reactive(target: any): any;
declare function shallowReactive(target: any): any;
declare function readonly(target: any): any;
declare function shallowReadonly(target: any): any;
declare function isReactive(value: any): any;
declare function isReadonly(value: any): boolean;
declare function isProxy(value: any): any;
declare function toRaw(observed: any): any;
declare function markRaw(value: any): any;
declare function isRef(r: any): boolean;
declare function ref(value: any): any;
declare function shallowRef(value: any): any;
declare function triggerRef(ref: any): void;
declare function unref(ref: any): any;
declare function customRef(factory: any): {
    __v_isRef: boolean;
    value: any;
};
declare function toRefs(object: any): {};
declare function toRef(object: any, key: any): {
    __v_isRef: boolean;
    value: any;
};
declare function computed(getterOrOptions: any): {
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
export { ITERATE_KEY, computed, customRef, effect, enableTracking, isProxy, isReactive, isReadonly, isRef, markRaw, pauseTracking, reactive, readonly, ref, resetTracking, shallowReactive, shallowReadonly, shallowRef, stop, toRaw, toRef, toRefs, track, trigger, triggerRef, unref };
