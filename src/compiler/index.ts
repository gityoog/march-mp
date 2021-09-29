import MPEntryPlugin from './entry/plugin'
import fixVue3This from './ts-transformer/fix-vue3-this'

const valueLoader = require.resolve('./value-loader')
const tsxLoader = require.resolve('./module/loader')

export {
  fixVue3This,
  valueLoader,
  tsxLoader
}

export default MPEntryPlugin