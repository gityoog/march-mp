import MPComponent from "./component";
import MPPage from "./page";
import { toRaw, markRaw, reactive } from './vue/reactive';
declare const MarchMP: {
    Page: typeof MPPage;
    Component: typeof MPComponent;
};
export { MPPage, MPComponent, toRaw, markRaw, reactive };
export default MarchMP;
