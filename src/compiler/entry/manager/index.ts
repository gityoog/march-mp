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
  }[] = []
  private oldComponents: oldData[] = []
  private oldDict: Record<string, oldData> = {}

  load(callback: (item: oldData) => void) {
    this.oldComponents.forEach(callback)
  }
  needLoad(data: EntryData) {
    return !data.isPage && !this.oldDict[data.name]
  }
  addPage(path: string, root?: string) {
    const name = this.nameCache.get({ path, root })
    this.pages.push({
      path, root
    })
    return name
  }
  getRoot(name: string) {
    return this.nameCache.getPackage(name)
  }
  setContext(context: string) {
    this.nameCache.setContext(context)
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
  complete() {
    this.oldComponents = this.data.filter(item => !item.isPage).map(item => ({
      path: item.path,
      name: item.name
    }))
    const dict: Record<string, oldData> = {}
    this.oldComponents.forEach(item => {
      dict[item.name] = item
    })
    this.oldDict = dict
    this.clear()
  }
  clear() {
    this.pages = []
    this.data = []
  }
}