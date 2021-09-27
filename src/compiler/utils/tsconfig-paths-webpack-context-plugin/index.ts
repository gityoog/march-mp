import Webpack from 'webpack'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import Path from 'path'

type options = NonNullable<ConstructorParameters<typeof TsconfigPathsPlugin>[0]>

export default class TsconfigPathsWebpackContextPlugin {
  options: options
  constructor(rawOptions: options = {}) { 
    this.options = rawOptions
  }
  apply(compiler: Webpack.Compiler) { 
    compiler.hooks.afterPlugins.tap('TsconfigPathsWebpackContextPlugin', (compiler) => {
      const tsconfigPathsPlugin = new TsconfigPathsPlugin({
        ...this.options,
        configFile: this.options.configFile || Path.resolve(compiler.options.context || '', './tsconfig.json')
      })
      compiler.options.resolve = compiler.options.resolve || {}
      compiler.options.resolve.plugins = (compiler.options.resolve.plugins || []).concat(tsconfigPathsPlugin)
    })
  }
}