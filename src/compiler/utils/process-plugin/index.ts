import Webpack from 'webpack'
import { stdout } from 'single-line-log'

export default class ProcessPlugin {
  private options: { process: boolean }
  constructor({ process = true }: { process?: boolean } = {}) {
    this.options = {
      process
    }
  }
  private name = 'ProcessPlugin'
  apply(compiler: Webpack.Compiler) {
    if (this.options.process) {
      new Webpack.ProgressPlugin(
        (percent, msg, module) => {
          stdout((percent * 100).toFixed(0) + '% ' + msg + ' ' + (module || '') + '\n')
        }
      ).apply(compiler)
    }
    compiler.hooks.compile.tap(this.name, () => {
      console.log('Building ...')
    })
    compiler.hooks.done.tap(this.name, stats => {
      if (stats.hasErrors()) {
        console.log(stats.toString({
          all: false,
          errors: true,
          colors: true
        }))
        console.log('Build failed with errors.')
      } else {
        if (stats.hasWarnings()) {
          console.log('Build success with warnings.')
          console.log(stats.toString({
            all: false,
            errors: true,
            warnings: true,
            colors: true
          }))
        }
        console.log('Build success. Time:', stats.toJson().time, 'ms')
      }
    })
  }
}