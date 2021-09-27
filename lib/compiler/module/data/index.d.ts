export default class ModuleData {
    path: string;
    static map: Map<string, ModuleData>;
    static Init(path: string): ModuleData;
    static Has(path: string): boolean;
    static Pick(path: string): ModuleData;
    private constructor();
    json: Record<any, any>;
    wxml: string;
    wxss: string;
    wxs: string;
    private children;
    setJSON(json: Record<any, any>): void;
    setWXML(value: string): void;
    addWXSS(value: string): void;
    setWXSS(value: string): void;
    setWXS(value: string): void;
    setStatic(type: 'wxss' | 'wxml' | 'json' | 'wxs', value: string): void;
    addChild(key: string, path: string): void;
    getChildren(): Record<string, string>;
    destory(): void;
}
