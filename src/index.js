import config from './config'

import VirtualScroller from './components/VirtualScroller.vue'

export {
  VirtualScroller,
}

function registerComponents (app, prefix) {
  app.component(`${prefix}virtual-scroller`, VirtualScroller)
}

const plugin = {
  // eslint-disable-next-line no-undef
  version: VERSION,
  install (app, options) {
    const finalOptions = Object.assign({}, {
      installComponents: true,
      componentsPrefix: '',
    }, options)

    for (const key in finalOptions) {
      if (typeof finalOptions[key] !== 'undefined') {
        config[key] = finalOptions[key]
      }
    }

    if (finalOptions.installComponents) {
      registerComponents(app, finalOptions.componentsPrefix)
    }
  },
}

export default plugin
