type result = {
  dict: Record<string, data> | null
  children: data[] | null
}

type data = {
  name: string
  path: string
  length: number
} & result


export default class DiffState {
  data: data[] = []
  dict: Record<string, data> = {}

  add(keys: string | string[]) {
    const children = Array.isArray(keys) ? [...keys] : [keys]
    let result: result = {
      dict: this.dict,
      children: this.data
    }
    while (result.dict && result.children && children.length > 0) {
      const key = children.splice(0, 1)[0]
      const hasNext = children.length > 0
      if (!result.dict[key]) {
        const data = {
          name: typeof key === 'number' ? `[${key}]` : `.${key}`,
          path: key,
          dict: hasNext ? {} : null,
          children: hasNext ? [] : null,
          get length() {
            if (this.children) {
              return this.children.reduce((s, i) => s + i.length, 0)
            }
            return 1
          }
        } as data
        result.dict[key] = data
        result.children.push(data)
      }
      const data = result.dict[key]
      if (data.length > 20) {
        data.children = data.dict = null
      }
      result.dict = data.dict
      result.children = data.children
    }
  }

  get() {
    const result: {
      name: string
      path: string[]
    }[] = []
    const forEach = (data: data, name: string, path: string[]) => {
      name = name + data.name
      path = path.concat(data.path)
      if (data.children) {
        data.children.forEach(item => {
          forEach(item, name, path)
        })
      } else {
        result.push({
          name,
          path
        })
      }
    }
    this.data.forEach(item => {
      forEach(item, '', [])
    })
    return result
  }

  reset() {
    this.data = []
    this.dict = {}
  }

  destroy() {
    this.data = null!
    this.dict = null!
  }
}