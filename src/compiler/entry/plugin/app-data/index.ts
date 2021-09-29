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
  }[] = []
  private content: string = ''
  private update() {
    this.entries = []
    const data = JSON.parse(this.content) as {
      pages?: string[]
      subpackages?: {
        root: string
        pages: string[]
      }[]
    }
    if (this.ignorePattern.length > 0) {
      data.pages = data.pages?.filter(page => !this.ignore(page))
      data.subpackages?.forEach(({ root, pages }) => {
        pages = pages.filter(page => !this.ignore(root + '/' + page))
      })
    }
    data.pages?.forEach(item => {
      this.entries.push({
        path: path.resolve(this.context, item + '.tsx')
      })
    })
    data.subpackages?.forEach(({ root, pages }) => {
      pages.forEach(item => {
        this.entries.push({
          root,
          path: path.resolve(this.context, root, item + '.tsx')
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
      this.source = new webpack.sources.CachedSource(
        new webpack.sources.RawSource(JSON.stringify(this.content, null, 2))
      )
      this.update()
    }
    return this.entries
  }
}