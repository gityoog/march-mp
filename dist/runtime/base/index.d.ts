import RuntimeStore from './store';
declare type pageInstance = WechatMiniprogram.Page.Instance<{}, {}>;
declare type componentInstance = WechatMiniprogram.Component.Instance<{}, {}, {}>;
declare type wxInstance = pageInstance | componentInstance;
export default class MPBase {
    static debug: boolean;
    static dataMap: WeakMap<wxInstance, MPBase>;
    static init<T extends MPBase>(instance: wxInstance, data: T, callback?: () => void): T;
    static bindData<T extends MPBase>(instance: wxInstance, data: T): T;
    static getData(instance: wxInstance): MPBase;
    static getRawData(instance: wxInstance): any;
    static destory(instance: wxInstance): void;
    static initEventsMethods(events: string[]): Record<string, (...args: any[]) => void>;
    protected $store: RuntimeStore;
    protected $ready: boolean;
    private $readyCallback;
    protected $onReady(callback: () => void): void;
    private $setReady;
    protected $destoryCallback: Array<() => void>;
    protected $destory(): void;
    /**编译后覆盖 render函数 */
    protected render(genProp: <T>(value: T, key: Array<string> | string, native?: boolean) => T, genEvent: <T>(value: T, key: Array<string> | string) => T): any;
}
export {};
