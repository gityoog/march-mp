import MPComponent from "./component"
import MPPage from "./page"
import Reactivity from "./reactivity"

const MarchMP = {
  Page: MPPage,
  Component: MPComponent,
}

namespace MarchMP {
  export type Page = MPPage
  export type Component = MPComponent
}

export function toRaw<T extends object>(data: T): T {
  return Reactivity.toRaw(data)
}

export function markRaw<T extends object>(data: T): T {
  return Reactivity.markRaw(data)
}

export function reactive<T extends object>(data: T): T {
  return Reactivity.reactive(data)
}

export {
  MPPage,
  MPComponent
}

export default MarchMP