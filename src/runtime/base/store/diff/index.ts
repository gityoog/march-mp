import DiffState from "./state"

export default class Diff {
  private data: Record<string, any> = {}
  private state = new DiffState

  reset() {
    this.state.reset()
  }

  get() {
    const data = this.state.get()
    if (data.length > 0) {
      const result: Record<string, any> = {}
      data.forEach(item => {
        result[item.name] = this.getValue(item.path)
      })
      return result
    }
  }

  add(key: string | string[], value: any, native?: boolean) {
    const oldValue = this.getValue(key)
    if (native) {
      if (oldValue !== value) {
        this.setValue(key, value)
        this.state.add(key)
      }
    } else {
      const newValue = this.deep(oldValue, value, key)
      if (newValue !== oldValue) {
        this.setValue(key, newValue)
      }
    }
  }

  destroy() {
    this.state.destroy()
    this.data = null!
  }

  private getValue(key: string | string[]) {
    return Array.isArray(key) ? get(this.data, key) : this.data[key]
  }

  private setValue(key: string | string[], value: any) {
    if (Array.isArray(key)) {
      set(this.data, key, value)
    } else {
      this.data[key] = value
    }
  }

  private deep(value: any, newValue: any, keys?: string | string[]): any {
    if (Array.isArray(newValue)) {
      if (keys !== undefined && (!value || value.length !== newValue.length)) {
        this.state.add(keys)
        keys = undefined
      }
      return newValue.map((item, index) => this.deep(value ? value[index] : undefined, item, keys !== undefined ? concat(keys, index as unknown as string) : undefined))
    } else if (isRecord(newValue)) {
      const result: any = {}
      for (const key in newValue) {
        result[key] = this.deep(value ? value[key] : undefined, newValue[key], keys !== undefined ? concat(keys, key) : undefined)
      }
      return result
    } else {
      if (keys !== undefined && value !== newValue) {
        this.state.add(keys)
      }
      return newValue
    }
  }
}

function concat(keys: string | string[], key: string) {
  return ([] as string[]).concat(keys).concat(key)
}

function get(obj: any, keys: string[]) {
  for (const key of keys) {
    obj = obj[key]
    if (obj === undefined) {
      return obj
    }
  }
  return obj
}

function set(obj: any, keys: string[], value: any) {
  keys.slice(0, -1).forEach(key => {
    if (!obj[key]) {
      obj[key] = []
    }
    obj = obj[key]
  })
  obj[keys.slice(-1)[0]] = value
}


function isObject(data: unknown): data is Record<any, any> {
  return typeof data === 'object' && data !== null
}

function isRecord(data: unknown): data is Record<any, any> {
  return Object.prototype.toString.call(data) === '[object Object]'
}