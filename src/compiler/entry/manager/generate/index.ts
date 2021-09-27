import ModuleData from "../../../module/data"

type node = {
  path: string
  children: Record<string, node>
  parent: node[]
}

type page = {
  path: string
  root?: string
}

function generateNodes(pages: page[]) {
  const dict: Record<string, node> = {}
  const getNode = (path: string) => {
    if (!dict[path]) {
      const node: node = {
        path,
        children: {},
        parent: []
      }
      dict[path] = node
    }
    return dict[path]
  }
  const addRelation = (node: node) => {
    const children = ModuleData.Pick(node.path).getChildren()
    for (const key in children) {
      const child = getNode(children[key])
      child.parent.push(node)
      node.children[key] = child
      addRelation(child)
    }
  }
  pages.forEach(page => {
    addRelation(getNode(page.path))
  })
  return dict
}

type entry = {
  path: string
  root?: string
  page: boolean
  name: string
  components: Record<string, entry>
}

//todo 需要优化
export default function generateEntry(pages: page[], getName: (params: { path: string, root?: string, component?: boolean }) => string) {
  let refs = generateNodes(pages)
  let packageSet: Record<string, Set<string | undefined>> = {}
  pages.forEach(page => {
    const set = packageSet[page.path] = new Set()
    set.add(page.root)
  })
  const getPackages = (node: node) => {
    if (!packageSet[node.path]) {
      const set = packageSet[node.path] = new Set
      node.parent.forEach(parent => {
        const packages = getPackages(parent)
        if (packages.has(undefined)) {
          set.add(undefined)
        } else {
          packages.forEach(value => {
            set.add(value)
          })
        }
      })
    }
    return packageSet[node.path]
  }

  const data: entry[] = []
  let dict: Record<string, Record<string, entry>> = {}
  const getEntry = (path: string, root?: string) => {
    const pack = packageSet[path].has(undefined) ? undefined : root
    const rootEntry = dict[pack || ''] = dict[pack || ''] || {}
    if (!rootEntry[path]) {
      data.push(
        rootEntry[path] = {
          path,
          root: pack,
          page: false,
          name: '',
          components: {}
        }
      )
    }
    return rootEntry[path]
  }
  const load = (node: node) => {
    const packages = getPackages(node)
    const entries = packages.has(undefined) ? [getEntry(node.path)] : [...packages].map(root => getEntry(node.path, root))
    for (const key in node.children) {
      const child = node.children[key]
      load(child)
      entries.forEach(entry => {
        entry.components[key] = getEntry(child.path, entry.root)
      })
    }
    return entries
  }

  pages.forEach(page => {
    load(refs[page.path]).forEach(entry => {
      entry.page = true
    })
  })
  data.forEach(item => {
    item.name = getName({
      path: item.path,
      root: item.root,
      component: !item.page
    })
  })
  refs = null!
  packageSet = null!
  dict = null!

  return data
}