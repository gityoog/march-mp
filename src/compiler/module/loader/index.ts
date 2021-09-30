import { LoaderContext, EntryPlugin, Dependency } from 'webpack'
import ModuleData from '../data'
import transform from './transform'
import fs from 'fs'
import webpack from 'webpack'
import State from './state'

export default function (this: LoaderContext<null>, source: string) {
  const data = ModuleData.Init(this.resourcePath)
  const state = new State(this.resourcePath)
  const callback = this.async();

  (async () => {
    transform(source, state)
    data.setWXML(state.wxml)
    data.setJSON(state.json)

    for (const file of state.cssfile) {
      const { source, err } = await new Promise<{
        source: string
        err?: Error | null
      }>((reslove) => {
        this.loadModule(file, (err, source) => {
          reslove({
            err,
            source
          })
        })
      })
      if (err) {
        this.emitError(err)
        continue
      }
      if (source) {
        data.addWXSS(JSON.parse(source))
      }
    }

    for (const name in state.components) {
      const component = state.components[name]
      const { filename, err } = await loadModule(this, component.path)
      if (err) {
        this.emitError(err)
        continue
      }
      data.addChild(name, filename)
      if (/\.js$/.test(filename)) {
        // 原生组件 导入wxss wxml json wxs
        const componentData = ModuleData.Init(filename)
        const filepath = filename.replace(/\.js$/, '');
        (['wxss', 'wxml', 'json', 'wxs'] as const).forEach(ext => {
          const path = filepath + '.' + ext
          if (fs.existsSync(path)) {
            componentData.setStatic(ext, fs.readFileSync(path).toString())
            this.addDependency(path)
          }
        })
      } else {
        state.setComponentNative(name)
      }
    }
    state.warning.forEach(warn => this.emitWarning(warn))
    const code = state.generate()
    state.destroy()
    return code
  })().then(source => {
    callback(null, source)
  }).catch((e: Error) => {
    callback(e)
  })
}

function loadModule(loaderContext: LoaderContext<null>, request: string) {
  // this.loadModule 会引起递归检测 
  return new Promise<{
    filename: string
    module: webpack.Module
    err?: Error
  }>((reslove) => {
    loaderContext.resolve(loaderContext.context, request, (err, path) => {
      if (err) return reslove({
        filename: null!,
        module: null!,
        err
      })
      const filename = path as string
      const compilation = loaderContext._compilation!
      compilation.buildQueue.increaseParallelism()
      compilation.addModuleChain(loaderContext.context, EntryPlugin.createDependency(filename, filename), (err, module) => {
        compilation.buildQueue.decreaseParallelism()
        if (err) return reslove({
          filename: null!,
          module: null!,
          err
        })
        loaderContext.addDependency(filename)
        reslove({
          filename,
          module: module!
        })
      })
    })
  })
}