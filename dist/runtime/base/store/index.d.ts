export default class RuntimeStore {
    private diff;
    addProp(key: string | string[], value: any, native?: boolean): void;
    start(): void;
    end(): Record<string, any> | undefined;
    private events;
    addEvent(key: string, fn: any): void;
    runEvent(key: string, arg: any, event: Event.Base<Record<string, Function>, void>): void;
    /**框架组件属性代理 */
    private propRecord;
    private propProxy;
    private proxyProp;
    /**事件属性代理 */
    private fnRecord;
    private fnProxy;
    private proxyFn;
    destroy(): void;
}
