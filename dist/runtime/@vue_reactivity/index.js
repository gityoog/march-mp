"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unref = exports.triggerRef = exports.trigger = exports.track = exports.toRefs = exports.toRef = exports.toRaw = exports.stop = exports.shallowRef = exports.shallowReadonly = exports.shallowReactive = exports.resetTracking = exports.ref = exports.readonly = exports.reactive = exports.pauseTracking = exports.markRaw = exports.isRef = exports.isReadonly = exports.isReactive = exports.isProxy = exports.enableTracking = exports.effect = exports.customRef = exports.computed = exports.ITERATE_KEY = void 0;
// @ts-nocheck edit with @vue/reactivity/dist/reactivity.esm-bundler.js
// Make a map and return a function for checking if a key
// is in that map.
//
// IMPORTANT: all calls of this function must be prefixed with /*#__PURE__*/
// So that rollup can tree-shake them if necessary.
function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? function (val) { return !!map[val.toLowerCase()]; } : function (val) { return !!map[val]; };
}
var EMPTY_OBJ = Object.freeze({});
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = function (val, key) { return hasOwnProperty.call(val, key); };
var isArray = Array.isArray;
var isFunction = function (val) { return typeof val === 'function'; };
var isSymbol = function (val) { return typeof val === 'symbol'; };
var isObject = function (val) { return val !== null && typeof val === 'object'; };
var objectToString = Object.prototype.toString;
var toTypeString = function (value) { return objectToString.call(value); };
var toRawType = function (value) {
    return toTypeString(value).slice(8, -1);
};
var cacheStringFunction = function (fn) {
    var cache = Object.create(null);
    return (function (str) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
};
var capitalize = cacheStringFunction(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
// compare whether a value has changed, accounting for NaN.
var hasChanged = function (value, oldValue) { return value !== oldValue && (value === value || oldValue === oldValue); };
var def = function (obj, key, value) {
    Object.defineProperty(obj, key, {
        configurable: true,
        value: value
    });
};
var targetMap = new WeakMap();
var effectStack = [];
var activeEffect;
var ITERATE_KEY = Symbol('iterate');
exports.ITERATE_KEY = ITERATE_KEY;
var MAP_KEY_ITERATE_KEY = Symbol('Map key iterate');
function isEffect(fn) {
    return fn && fn._isEffect === true;
}
function effect(fn, options) {
    if (options === void 0) { options = EMPTY_OBJ; }
    if (isEffect(fn)) {
        fn = fn.raw;
    }
    var effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}
exports.effect = effect;
function stop(effect) {
    if (effect.active) {
        cleanup(effect);
        if (effect.options.onStop) {
            effect.options.onStop();
        }
        effect.active = false;
    }
}
exports.stop = stop;
var uid = 0;
function createReactiveEffect(fn, options) {
    var effect = function reactiveEffect() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!effect.active) {
            return options.scheduler ? undefined : fn.apply(void 0, __spreadArray([], __read(args), false));
        }
        if (!effectStack.includes(effect)) {
            cleanup(effect);
            try {
                enableTracking();
                effectStack.push(effect);
                activeEffect = effect;
                return fn.apply(void 0, __spreadArray([], __read(args), false));
            }
            finally {
                effectStack.pop();
                resetTracking();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    };
    effect.id = uid++;
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
}
function cleanup(effect) {
    var deps = effect.deps;
    if (deps.length) {
        for (var i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
}
exports.pauseTracking = pauseTracking;
function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
}
exports.enableTracking = enableTracking;
function resetTracking() {
    var last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
}
exports.resetTracking = resetTracking;
function track(target, type, key) {
    if (!shouldTrack || activeEffect === undefined) {
        return;
    }
    var depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    var dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if (activeEffect.options.onTrack) {
            activeEffect.options.onTrack({
                effect: activeEffect,
                target: target,
                type: type,
                key: key
            });
        }
    }
}
exports.track = track;
function trigger(target, type, key, newValue, oldValue, oldTarget) {
    var depsMap = targetMap.get(target);
    if (!depsMap) {
        // never been tracked
        return;
    }
    var effects = new Set();
    var computedRunners = new Set();
    var add = function (effectsToAdd) {
        if (effectsToAdd) {
            effectsToAdd.forEach(function (effect) {
                if (effect !== activeEffect || !shouldTrack) {
                    if (effect.options.computed) {
                        computedRunners.add(effect);
                    }
                    else {
                        effects.add(effect);
                    }
                }
            });
        }
    };
    if (type === "clear" /* CLEAR */) {
        // collection being cleared
        // trigger all effects for target
        depsMap.forEach(add);
    }
    else if (key === 'length' && isArray(target)) {
        depsMap.forEach(function (dep, key) {
            if (key === 'length' || key >= newValue) {
                add(dep);
            }
        });
    }
    else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            add(depsMap.get(key));
        }
        // also run for iteration key on ADD | DELETE | Map.SET
        var isAddOrDelete = type === "add" /* ADD */ ||
            (type === "delete" /* DELETE */ && !isArray(target));
        if (isAddOrDelete ||
            (type === "set" /* SET */ && target instanceof Map)) {
            add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY));
        }
        if (isAddOrDelete && target instanceof Map) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY));
        }
    }
    var run = function (effect) {
        if (effect.options.onTrigger) {
            effect.options.onTrigger({
                effect: effect,
                target: target,
                key: key,
                type: type,
                newValue: newValue,
                oldValue: oldValue,
                oldTarget: oldTarget
            });
        }
        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        }
        else {
            effect();
        }
    };
    // Important: computed effects must be run first so that computed getters
    // can be invalidated before any normal effects that depend on them are run.
    computedRunners.forEach(run);
    effects.forEach(run);
}
exports.trigger = trigger;
var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
    .map(function (key) { return Symbol[key]; })
    .filter(isSymbol));
var get = /*#__PURE__*/ createGetter();
var shallowGet = /*#__PURE__*/ createGetter(false, true);
var readonlyGet = /*#__PURE__*/ createGetter(true);
var shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true);
var arrayInstrumentations = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(function (key) {
    arrayInstrumentations[key] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var arr = toRaw(this);
        for (var i = 0, l = this.length; i < l; i++) {
            track(arr, "get" /* GET */, i + '');
        }
        // we run the method using the original args first (which may be reactive)
        var res = arr[key].apply(arr, __spreadArray([], __read(args), false));
        if (res === -1 || res === false) {
            // if that didn't work, run it again using raw values.
            return arr[key].apply(arr, __spreadArray([], __read(args.map(toRaw)), false));
        }
        else {
            return res;
        }
    };
});
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key, receiver) {
        if (key === "__v_isReactive" /* isReactive */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* isReadonly */) {
            return isReadonly;
        }
        else if (key === "__v_raw" /* raw */) {
            return target;
        }
        var targetIsArray = isArray(target);
        if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
            return Reflect.get(arrayInstrumentations, key, receiver);
        }
        var res = Reflect.get(target, key, receiver);
        if (isSymbol(key) && builtInSymbols.has(key) || key === '__proto__') {
            return res;
        }
        if (shallow) {
            !isReadonly && track(target, "get" /* GET */, key);
            return res;
        }
        if (isRef(res)) {
            if (targetIsArray) {
                !isReadonly && track(target, "get" /* GET */, key);
                return res;
            }
            else {
                // ref unwrapping, only for Objects, not for Arrays.
                return res.value;
            }
        }
        !isReadonly && track(target, "get" /* GET */, key);
        return isObject(res)
            ? isReadonly
                ? // need to lazy access readonly and reactive here to avoid
                    // circular dependency
                    readonly(res)
                : reactive(res)
            : res;
    };
}
var set = /*#__PURE__*/ createSetter();
var shallowSet = /*#__PURE__*/ createSetter(true);
function createSetter(shallow) {
    if (shallow === void 0) { shallow = false; }
    return function set(target, key, value, receiver) {
        var oldValue = target[key];
        if (!shallow) {
            value = toRaw(value);
            if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
                return true;
            }
        }
        var hadKey = hasOwn(target, key);
        var result = Reflect.set(target, key, value, receiver);
        // don't trigger if target is something up in the prototype chain of original
        if (target === toRaw(receiver)) {
            if (!hadKey) {
                trigger(target, "add" /* ADD */, key, value);
            }
            else if (hasChanged(value, oldValue)) {
                trigger(target, "set" /* SET */, key, value, oldValue);
            }
        }
        return result;
    };
}
function deleteProperty(target, key) {
    var hadKey = hasOwn(target, key);
    var oldValue = target[key];
    var result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
    }
    return result;
}
function has(target, key) {
    var result = Reflect.has(target, key);
    track(target, "has" /* HAS */, key);
    return result;
}
function ownKeys(target) {
    track(target, "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.ownKeys(target);
}
function getKeys(target) {
    var result = [];
    for (var key in target) {
        result.push(key);
    }
    return result;
}
var testProxy = new Proxy(Object.defineProperty({}, 'isLowVersion', { value: '', enumerable: false }), { ownKeys: function (target) { return Object.getOwnPropertyNames(target); } });
var isLowVersion = Object.keys(testProxy).includes('isLowVersion') || getKeys(testProxy).includes('isLowVersion');
var mutableHandlers = {
    get: get,
    set: set,
    deleteProperty: deleteProperty,
    has: has,
    ownKeys: isLowVersion ? undefined : ownKeys
};
var readonlyHandlers = {
    get: readonlyGet,
    has: has,
    ownKeys: ownKeys,
    set: function (target, key) {
        {
            console.warn("Set operation on key \"" + String(key) + "\" failed: target is readonly.", target);
        }
        return true;
    },
    deleteProperty: function (target, key) {
        {
            console.warn("Delete operation on key \"" + String(key) + "\" failed: target is readonly.", target);
        }
        return true;
    }
};
var shallowReactiveHandlers = __assign(__assign({}, mutableHandlers), { get: shallowGet, set: shallowSet });
// Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.
var shallowReadonlyHandlers = __assign(__assign({}, readonlyHandlers), { get: shallowReadonlyGet });
var toReactive = function (value) { return isObject(value) ? reactive(value) : value; };
var toReadonly = function (value) { return isObject(value) ? readonly(value) : value; };
var toShallow = function (value) { return value; };
var getProto = function (v) { return Reflect.getPrototypeOf(v); };
function get$1(target, key, wrap) {
    target = toRaw(target);
    var rawKey = toRaw(key);
    if (key !== rawKey) {
        track(target, "get" /* GET */, key);
    }
    track(target, "get" /* GET */, rawKey);
    var _a = getProto(target), has = _a.has, get = _a.get;
    if (has.call(target, key)) {
        return wrap(get.call(target, key));
    }
    else if (has.call(target, rawKey)) {
        return wrap(get.call(target, rawKey));
    }
}
function has$1(key) {
    var target = toRaw(this);
    var rawKey = toRaw(key);
    if (key !== rawKey) {
        track(target, "has" /* HAS */, key);
    }
    track(target, "has" /* HAS */, rawKey);
    var has = getProto(target).has;
    return has.call(target, key) || has.call(target, rawKey);
}
function size(target) {
    target = toRaw(target);
    track(target, "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.get(getProto(target), 'size', target);
}
function add(value) {
    value = toRaw(value);
    var target = toRaw(this);
    var proto = getProto(target);
    var hadKey = proto.has.call(target, value);
    var result = proto.add.call(target, value);
    if (!hadKey) {
        trigger(target, "add" /* ADD */, value, value);
    }
    return result;
}
function set$1(key, value) {
    value = toRaw(value);
    var target = toRaw(this);
    var _a = getProto(target), has = _a.has, get = _a.get, set = _a.set;
    var hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    }
    else {
        checkIdentityKeys(target, has, key);
    }
    var oldValue = get.call(target, key);
    var result = set.call(target, key, value);
    if (!hadKey) {
        trigger(target, "add" /* ADD */, key, value);
    }
    else if (hasChanged(value, oldValue)) {
        trigger(target, "set" /* SET */, key, value, oldValue);
    }
    return result;
}
function deleteEntry(key) {
    var target = toRaw(this);
    var _a = getProto(target), has = _a.has, get = _a.get, del = _a.delete;
    var hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    }
    else {
        checkIdentityKeys(target, has, key);
    }
    var oldValue = get ? get.call(target, key) : undefined;
    // forward the operation before queueing reactions
    var result = del.call(target, key);
    if (hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
    }
    return result;
}
function clear() {
    var target = toRaw(this);
    var hadItems = target.size !== 0;
    var oldTarget = target instanceof Map
        ? new Map(target)
        : new Set(target);
    // forward the operation before queueing reactions
    var result = getProto(target).clear.call(target);
    if (hadItems) {
        trigger(target, "clear" /* CLEAR */, undefined, undefined, oldTarget);
    }
    return result;
}
function createForEach(isReadonly, shallow) {
    return function forEach(callback, thisArg) {
        var observed = this;
        var target = toRaw(observed);
        var wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive;
        !isReadonly && track(target, "iterate" /* ITERATE */, ITERATE_KEY);
        // important: create sure the callback is
        // 1. invoked with the reactive map as `this` and 3rd arg
        // 2. the value received should be a corresponding reactive/readonly.
        function wrappedCallback(value, key) {
            return callback.call(thisArg, wrap(value), wrap(key), observed);
        }
        return getProto(target).forEach.call(target, wrappedCallback);
    };
}
function createIterableMethod(method, isReadonly, shallow) {
    return function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var target = toRaw(this);
        var isMap = target instanceof Map;
        var isPair = method === 'entries' || (method === Symbol.iterator && isMap);
        var isKeyOnly = method === 'keys' && isMap;
        var innerIterator = getProto(target)[method].apply(target, args);
        var wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive;
        !isReadonly &&
            track(target, "iterate" /* ITERATE */, isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        // return a wrapped iterator which returns observed versions of the
        // values emitted from the real iterator
        return _a = {
                // iterator protocol
                next: function () {
                    var _a = innerIterator.next(), value = _a.value, done = _a.done;
                    return done
                        ? { value: value, done: done }
                        : {
                            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                            done: done
                        };
                }
            },
            // iterable protocol
            _a[Symbol.iterator] = function () {
                return this;
            },
            _a;
    };
}
function createReadonlyMethod(type) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        {
            var key = args[0] ? "on key \"" + args[0] + "\" " : "";
            console.warn(capitalize(type) + " operation " + key + "failed: target is readonly.", toRaw(this));
        }
        return type === "delete" /* DELETE */ ? false : this;
    };
}
var mutableInstrumentations = {
    get: function (key) {
        return get$1(this, key, toReactive);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add: add,
    set: set$1,
    delete: deleteEntry,
    clear: clear,
    forEach: createForEach(false, false)
};
var shallowInstrumentations = {
    get: function (key) {
        return get$1(this, key, toShallow);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add: add,
    set: set$1,
    delete: deleteEntry,
    clear: clear,
    forEach: createForEach(false, true)
};
var readonlyInstrumentations = {
    get: function (key) {
        return get$1(this, key, toReadonly);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add: createReadonlyMethod("add" /* ADD */),
    set: createReadonlyMethod("set" /* SET */),
    delete: createReadonlyMethod("delete" /* DELETE */),
    clear: createReadonlyMethod("clear" /* CLEAR */),
    forEach: createForEach(true, false)
};
var iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
iteratorMethods.forEach(function (method) {
    mutableInstrumentations[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations[method] = createIterableMethod(method, true, false);
    shallowInstrumentations[method] = createIterableMethod(method, true, true);
});
function createInstrumentationGetter(isReadonly, shallow) {
    var instrumentations = shallow
        ? shallowInstrumentations
        : isReadonly
            ? readonlyInstrumentations
            : mutableInstrumentations;
    return function (target, key, receiver) {
        if (key === "__v_isReactive" /* isReactive */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* isReadonly */) {
            return isReadonly;
        }
        else if (key === "__v_raw" /* raw */) {
            return target;
        }
        return Reflect.get(hasOwn(instrumentations, key) && key in target
            ? instrumentations
            : target, key, receiver);
    };
}
var mutableCollectionHandlers = {
    get: createInstrumentationGetter(false, false)
};
var shallowCollectionHandlers = {
    get: createInstrumentationGetter(false, true)
};
var readonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, false)
};
function checkIdentityKeys(target, has, key) {
    var rawKey = toRaw(key);
    if (rawKey !== key && has.call(target, rawKey)) {
        var type = toRawType(target);
        console.warn("Reactive " + type + " contains both the raw and reactive " +
            ("versions of the same object" + (type === "Map" ? "as keys" : "") + ", ") +
            "which can lead to inconsistencies. " +
            "Avoid differentiating between the raw and reactive versions " +
            "of an object and only use the reactive version if possible.");
    }
}
var collectionTypes = new Set([Set, Map, WeakMap, WeakSet]);
var isObservableType = /*#__PURE__*/ makeMap('Object,Array,Map,Set,WeakMap,WeakSet');
var canObserve = function (value) {
    return (!value.__v_skip &&
        isObservableType(toRawType(value)) &&
        !Object.isFrozen(value));
};
function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (target && target.__v_isReadonly) {
        return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers);
}
exports.reactive = reactive;
// Return a reactive-copy of the original object, where only the root level
// properties are reactive, and does NOT unwrap refs nor recursively convert
// returned properties.
function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers);
}
exports.shallowReactive = shallowReactive;
function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers);
}
exports.readonly = readonly;
// Return a reactive-copy of the original object, where only the root level
// properties are readonly, and does NOT unwrap refs nor recursively convert
// returned properties.
// This is used for creating the props proxy object for stateful components.
function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, readonlyCollectionHandlers);
}
exports.shallowReadonly = shallowReadonly;
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers) {
    if (!isObject(target)) {
        {
            console.warn("value cannot be made reactive: " + String(target));
        }
        return target;
    }
    // target is already a Proxy, return it.
    // exception: calling readonly() on a reactive object
    if (target.__v_raw && !(isReadonly && target.__v_isReactive)) {
        return target;
    }
    // target already has corresponding Proxy
    if (hasOwn(target, isReadonly ? "__v_readonly" /* readonly */ : "__v_reactive" /* reactive */)) {
        return isReadonly ? target.__v_readonly : target.__v_reactive;
    }
    // only a whitelist of value types can be observed.
    if (!canObserve(target)) {
        return target;
    }
    var observed = new Proxy(target, collectionTypes.has(target.constructor) ? collectionHandlers : baseHandlers);
    def(target, isReadonly ? "__v_readonly" /* readonly */ : "__v_reactive" /* reactive */, observed);
    return observed;
}
function isReactive(value) {
    if (isReadonly(value)) {
        return isReactive(value.__v_raw);
    }
    return !!(value && value.__v_isReactive);
}
exports.isReactive = isReactive;
function isReadonly(value) {
    return !!(value && value.__v_isReadonly);
}
exports.isReadonly = isReadonly;
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
exports.isProxy = isProxy;
function toRaw(observed) {
    return (observed && toRaw(observed.__v_raw)) || observed;
}
exports.toRaw = toRaw;
function markRaw(value) {
    def(value, "__v_skip" /* skip */, true);
    return value;
}
exports.markRaw = markRaw;
var convert = function (val) { return isObject(val) ? reactive(val) : val; };
function isRef(r) {
    return r ? r.__v_isRef === true : false;
}
exports.isRef = isRef;
function ref(value) {
    return createRef(value);
}
exports.ref = ref;
function shallowRef(value) {
    return createRef(value, true);
}
exports.shallowRef = shallowRef;
function createRef(rawValue, shallow) {
    if (shallow === void 0) { shallow = false; }
    if (isRef(rawValue)) {
        return rawValue;
    }
    var value = shallow ? rawValue : convert(rawValue);
    var r = {
        __v_isRef: true,
        get value() {
            track(r, "get" /* GET */, 'value');
            return value;
        },
        set value(newVal) {
            if (hasChanged(toRaw(newVal), rawValue)) {
                rawValue = newVal;
                value = shallow ? newVal : convert(newVal);
                trigger(r, "set" /* SET */, 'value', { newValue: newVal });
            }
        }
    };
    return r;
}
function triggerRef(ref) {
    trigger(ref, "set" /* SET */, 'value', { newValue: ref.value });
}
exports.triggerRef = triggerRef;
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
exports.unref = unref;
function customRef(factory) {
    var _a = factory(function () { return track(r, "get" /* GET */, 'value'); }, function () { return trigger(r, "set" /* SET */, 'value'); }), get = _a.get, set = _a.set;
    var r = {
        __v_isRef: true,
        get value() {
            return get();
        },
        set value(v) {
            set(v);
        }
    };
    return r;
}
exports.customRef = customRef;
function toRefs(object) {
    if (!isProxy(object)) {
        console.warn("toRefs() expects a reactive object but received a plain one.");
    }
    var ret = {};
    for (var key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
exports.toRefs = toRefs;
function toRef(object, key) {
    return {
        __v_isRef: true,
        get value() {
            return object[key];
        },
        set value(newVal) {
            object[key] = newVal;
        }
    };
}
exports.toRef = toRef;
function computed(getterOrOptions) {
    var getter;
    var setter;
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = function () {
            console.warn('Write operation failed: computed value is readonly');
        };
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    var dirty = true;
    var value;
    var computed;
    var runner = effect(getter, {
        lazy: true,
        // mark effect as computed so that it gets priority during trigger
        computed: true,
        scheduler: function () {
            if (!dirty) {
                dirty = true;
                trigger(computed, "set" /* SET */, 'value');
            }
        }
    });
    computed = {
        __v_isRef: true,
        // expose effect so computed can be stopped
        effect: runner,
        get value() {
            if (dirty) {
                value = runner();
                dirty = false;
            }
            track(computed, "get" /* GET */, 'value');
            return value;
        },
        set value(newValue) {
            setter(newValue);
        }
    };
    return computed;
}
exports.computed = computed;
