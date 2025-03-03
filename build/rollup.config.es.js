import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name: 'vue-virtual-scroller',
    file: 'dist/vue-virtual-scroller-classic.esm.js',
    format: 'es',
    sourcemap: true,
  },
  external: [
    ...base.external,
    'mitt',
    'vue-observe-visibility',
    'vue-resize',
  ],
})

export default config
