import MPBase from "../base";
export default class MPPage extends MPBase {
    protected readonly $this: WechatMiniprogram.Page.Instance<{}, {}>;
    protected onLoad?(data: Record<string, string | undefined>): void;
    protected onShow?(): void;
    protected onHide?(): void;
    protected onUnload?(): void;
    protected onReady?(): void;
    static create({ events }: {
        events: string[];
    }): void;
}
