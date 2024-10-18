import MPComponent from "./component";
import MPPage from "./page";
declare const MarchMP: {
    Page: typeof MPPage;
    Component: typeof MPComponent;
};
declare namespace MarchMP {
    type Page = MPPage;
    type Component = MPComponent;
}
export declare function toRaw<T extends object>(data: T): T;
export declare function markRaw<T extends object>(data: T): T;
export declare function reactive<T extends object>(data: T): T;
export { MPPage, MPComponent };
export default MarchMP;
