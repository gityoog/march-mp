import Path from 'path'

export function genEntryName({ root, path, context, component = false }: { root?: string, path: string, context: string, component?: boolean }) {
  return Path.join(
    root || '',
    component ? 'components' : '',
    Path.relative(Path.resolve(context, root || ''), path)
      .replace(/\.\.[\\/]/g, '@').replace(/\.[\\/]/g, '')
  ).replace(/\.tsx$/, '.js')
}
