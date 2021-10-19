import MPBase from "../base";
export default class MPComponent<
/**组件需要传入参数 */
T extends object = {}, 
/**有默认值的组件参数名称, 默认值请申明在static propsDefault中*/
P extends keyof T = never> extends MPBase {
    /**组件数据监控 { 字段名称: 运行的组件方法名称 } */
    static observers: Record<string, string>;
    /**组件参数默认值 */
    static propsDefault: Record<string, any>;
    /**组件参数 编译后覆盖 */
    static properties: Record<string, any>;
    static $options: any;
    static create({ properties, events }: {
        properties: Record<string, any>;
        events: string[];
    }): string;
    protected created?(): void;
    protected detached?(): void;
    protected attached?(): void;
    protected readonly $this: WechatMiniprogram.Component.Instance<{}, {}, {}>;
    readonly $props: T & ([P] extends [never] ? {} : {
        [key in P]-?: T[P];
    });
    constructor(args?: Readonly<T>);
}
