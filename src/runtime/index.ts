import MPComponent from "./component"
import MPPage from "./page"
import { toRaw, markRaw } from './vue/reactive'

const MarchMP = {
  Page: MPPage,
  Component: MPComponent,
}

export {
  MPPage,
  MPComponent,
  toRaw,
  markRaw
}

export default MarchMP