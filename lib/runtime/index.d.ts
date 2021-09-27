import MPComponent from "./component";
import MPPage from "./page";
import { toRaw, markRaw } from './vue/reactive';
declare const MarchMP: {
    Page: typeof MPPage;
    Component: typeof MPComponent;
};
export { MPPage, MPComponent, toRaw, markRaw };
export default MarchMP;
