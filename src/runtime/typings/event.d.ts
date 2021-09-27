
declare namespace Event {
  type Base<T = object, D = { value: string }> = {
    type: string
    currentTarget: currentTarget<T>
    detail: D
  }
  type currentTarget<T = object> = {
    dataset: T
  }
  type Change<T = object, D = { value: string }> = {
    type: 'change'
    currentTarget: currentTarget<T>
    detail: D
  }
  type Input<T = object> = {
    type: 'input'
    currentTarget: currentTarget<T>
    detail: {
      value: string
      cursor: number
      keyCode: number
    }
  }
  type Tap<T = object> = {
    type: 'tap'
    currentTarget: currentTarget<T>
  }
  type SwitchChange<T = object> = {
    currentTarget: currentTarget<T>
    detail: {
      value: boolean
    }
  }
  type ColumnChange<T = object> = {
    type: 'columnchange'
    currentTarget: currentTarget<T>
    detail: {
      column: number
      value: number
    }
  }
  type ImageUpload<T> = { currentTarget: currentTarget<T>, type: 'update', detail: ({ type: 'add' } | { type: 'preview', index: number } | { type: 'remove', index: number }) & { from: 'imageupload' } }
}