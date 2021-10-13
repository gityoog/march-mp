import path from 'path'
import webpack from 'webpack'

export default class AppData {
  name = 'app.json'
  path = ''
  context = ''
  source: webpack.sources.Source | null = null
  setContext(context: string) {
    this.context = context
    this.path = path.resolve(context, this.name)
  }
  private ignorePattern: Array<string | RegExp> = []

  setIgnore(data?: Array<string | RegExp>) {
    this.ignorePattern = data || []
  }

  private ignore(page: string) {
    return this.ignorePattern.some(item => {
      if (typeof item === 'string') {
        return page === item
      } else {
        return item.test(page)
      }
    })
  }
  private entries: {
    root?: string
    path: string
    independent?: boolean
  }[] = []
  private content: string = ''
  private roots: string[] = []
  private independents = new Set<string>()
  private update() {
    this.entries = []
    this.roots = []
    this.independents.clear()
    const data = JSON.parse(this.content) as {
      pages?: string[]
      subpackages?: {
        root: string
        pages: string[]
        independent?: boolean
      }[]
    }
    if (this.ignorePattern.length > 0) {
      data.pages = data.pages?.filter(page => !this.ignore(page))
      data.subpackages?.forEach(({ root, pages }) => {
        pages = pages.filter(page => !this.ignore(root + '/' + page))
      })
    }
    this.source = new webpack.sources.CachedSource(
      new webpack.sources.RawSource(JSON.stringify(data, null, 2))
    )
    data.pages?.forEach(item => {
      this.entries.push({
        path: path.resolve(this.context, item + '.tsx')
      })
    })
    data.subpackages?.forEach(({ root, pages, independent }) => {
      this.roots.push(root)
      independent && this.independents.add(root)
      pages.forEach(item => {
        this.entries.push({
          root,
          path: path.resolve(this.context, root, item + '.tsx'),
          independent
        })
      })
    })
  }
  getEntries(content: string | Buffer) {
    if (typeof content !== 'string') {
      content = content.toString()
    }
    if (this.content !== content) {
      this.content = content
      this.update()
    }
    return this.entries
  }
  getRoots() {
    return this.roots
  }
  isIndependent(root: string) {
    return this.independents.has(root)
  }
}