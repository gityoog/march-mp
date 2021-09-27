import webpack from 'webpack'
import { stdout } from 'single-line-log'

export default class ProcessPlugin {
  private options: { process: boolean }
  constructor({ process = true }: { process?: boolean } = {}) {
    this.options = {
      process
    }
  }
  private name = 'ProcessPlugin'
  private done = false
  apply(compiler: webpack.Compiler) {
    if (this.options.process) {
      new webpack.ProgressPlugin(
        (percent, msg, module) => {
          !this.done && stdout((percent * 100).toFixed(0) + '% ' + msg + ' ' + (module || '') + '\n')
        }
      ).apply(compiler)
    }
    compiler.hooks.compile.tap(this.name, () => {
      this.done = false
      console.log('Building ...')
    })
    compiler.hooks.done.tap(this.name, stats => {
      this.done = true
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