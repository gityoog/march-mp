import MPComponent from "./component"
import MPPage from "./page"
import { toRaw, markRaw, reactive } from './@vue_reactivity'

const MarchMP = {
  Page: MPPage,
  Component: MPComponent,
}

export {
  MPPage,
  MPComponent,
  toRaw,
  markRaw,
  reactive
}

export default MarchMP