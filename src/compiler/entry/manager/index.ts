import EntryData from '../data'
import EntryNameCache from '../name'
import generateEntry from './generate'

type oldData = {
  path: string
  name: string
}

export default class EntryManager {
  data: EntryData[] = []
  private nameCache = new EntryNameCache
  private pages: {
    path: string
    root?: string
    independent?: boolean
  }[] = []
  private loaded = new Set<string>()

  loadOld(callback: (item: oldData) => void) {
    this.loaded.clear()
    this.data
      .filter(item => !item.isPage)
      .forEach(item => {
        this.loaded.add(item.name)
        callback({
          path: item.path,
          name: item.name
        })
      })
    this.clear()
  }
  needLoad(data: EntryData) {
    return !data.isPage && !this.loaded.has(data.name)
  }
  addPage(path: string, root?: string, independent?: boolean) {
    const name = this.nameCache.get({ path, root })
    this.pages.push({
      path, root, independent
    })
    return name
  }
  getRoot(name: string) {
    return this.nameCache.getPackage(name)
  }
  setContext(context: string) {
    this.nameCache.setContext(context)
  }
  getNotUsed() {
    const used = new Set(this.data.map(item => item.name))
    const notUsed: string[] = []
    this.loaded.forEach(name => {
      if (!used.has(name)) {
        notUsed.push(name)
      }
    })
    return notUsed
  }
  generate() {
    this.data = generateEntry(this.pages, (params: { path: string, root?: string, component?: boolean }) => {
      return this.nameCache.get(params)
    })
      .map(entry => {
        const components: Record<string, string> = {}
        for (const key in entry.components) {
          components[key] = entry.components[key].name
        }
        return new EntryData({
          name: entry.name,
          path: entry.path,
          page: entry.page,
          components
        })
      })
  }
  clear() {
    this.pages = []
    this.data = []
  }
}