import path from 'path'

export default class EntryNameCache {
  private context = ''
  private packageDict: Record<string, string | undefined> = {}
  private cache: Record<string, Record<string, string>> = {}

  setContext(context: string) {
    this.context = context
  }
  get(params: { path: string, root?: string, component?: boolean }) {
    const key = params.root || ''
    if (!this.cache[key]) {
      this.cache[key] = {}
    }
    if (!this.cache[key][params.path]) {
      const name = path.join(
        params.root || '',
        params.component ? 'components' : '',
        path.relative(path.join(this.context, params.root || ''), params.path)
          .replace(/\.\.[\\/]/g, '@').replace(/\.[\\/]/g, '')
      ).replace(/\.tsx$/, '.js')
      this.cache[key][params.path] = name
      this.packageDict[name] = params.root
    }
    return this.cache[key][params.path]
  }

  getPackage(name: string) {
    return this.packageDict[name]
  }
}