import MPComponent from "./component";
import MPPage from "./page";
import { toRaw, markRaw, reactive } from './@vue_reactivity';
declare const MarchMP: {
    Page: typeof MPPage;
    Component: typeof MPComponent;
};
declare namespace MarchMP {
    type Page = MPPage;
    type Component = MPComponent;
}
export { MPPage, MPComponent, toRaw, markRaw, reactive };
export default MarchMP;
