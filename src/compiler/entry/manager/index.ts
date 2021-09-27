import EntryData from '../data'
import EntryNameCache from '../name'
import generateEntry from './generate'

export default class EntryManager {
  data: EntryData[] = []
  private nameCache = new EntryNameCache
  private pages: {
    path: string
    root?: string
  }[] = []
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
  clear() {
    this.pages = []
    this.data = []
  }
}