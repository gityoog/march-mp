export declare function buildMPData<T>(object: T): {
    __origin__fn: () => T;
};
export declare function initMPData<T>(object: T): boolean;
export declare function isMPDataReady<T>(object: T): boolean;
export declare function originMPData<T>(object: T, info?: string, other?: any): T;
