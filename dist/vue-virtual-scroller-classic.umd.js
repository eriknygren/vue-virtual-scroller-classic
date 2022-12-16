(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue'), require('vue-observe-visibility')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue', 'vue-observe-visibility'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["vue-virtual-scroller"] = {}, global.vue, global.vueObserveVisibility));
})(this, (function (exports, vue, vueObserveVisibility) { 'use strict';

  var config = {
    itemsLimit: 1000
  };

  function getInternetExplorerVersion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');

    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');

    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');

    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    } // other browser


    return -1;
  }

  let isIE;

  function initCompat () {
    if (!initCompat.init) {
      initCompat.init = true;
      isIE = getInternetExplorerVersion() !== -1;
    }
  }

  var script$1 = {
    name: 'ResizeObserver',

    props: {
      emitOnMount: {
        type: Boolean,
        default: false,
      },

      ignoreWidth: {
        type: Boolean,
        default: false,
      },

      ignoreHeight: {
        type: Boolean,
        default: false,
      },
    },

    emits: [
      'notify',
    ],

    mounted () {
      initCompat();
      vue.nextTick(() => {
        this._w = this.$el.offsetWidth;
        this._h = this.$el.offsetHeight;
        if (this.emitOnMount) {
          this.emitSize();
        }
      });
      const object = document.createElement('object');
      this._resizeObject = object;
      object.setAttribute('aria-hidden', 'true');
      object.setAttribute('tabindex', -1);
      object.onload = this.addResizeHandlers;
      object.type = 'text/html';
      if (isIE) {
        this.$el.appendChild(object);
      }
      object.data = 'about:blank';
      if (!isIE) {
        this.$el.appendChild(object);
      }
    },

    beforeUnmount () {
      this.removeResizeHandlers();
    },

    methods: {
      compareAndNotify () {
        if ((!this.ignoreWidth && this._w !== this.$el.offsetWidth) || (!this.ignoreHeight && this._h !== this.$el.offsetHeight)) {
          this._w = this.$el.offsetWidth;
          this._h = this.$el.offsetHeight;
          this.emitSize();
        }
      },

      emitSize () {
        this.$emit('notify', {
          width: this._w,
          height: this._h,
        });
      },

      addResizeHandlers () {
        this._resizeObject.contentDocument.defaultView.addEventListener('resize', this.compareAndNotify);
        this.compareAndNotify();
      },

      removeResizeHandlers () {
        if (this._resizeObject && this._resizeObject.onload) {
          if (!isIE && this._resizeObject.contentDocument) {
            this._resizeObject.contentDocument.defaultView.removeEventListener('resize', this.compareAndNotify);
          }
          this.$el.removeChild(this._resizeObject);
          this._resizeObject.onload = null;
          this._resizeObject = null;
        }
      },
    },
  };

  const _withId = /*#__PURE__*/vue.withScopeId("data-v-b329ee4c");

  vue.pushScopeId("data-v-b329ee4c");
  const _hoisted_1 = {
    class: "resize-observer",
    tabindex: "-1"
  };
  vue.popScopeId();

  const render$1 = /*#__PURE__*/_withId((_ctx, _cache, $props, $setup, $data, $options) => {
    return (vue.openBlock(), vue.createBlock("div", _hoisted_1))
  });

  script$1.render = render$1;
  script$1.__scopeId = "data-v-b329ee4c";
  script$1.__file = "src/components/ResizeObserver.vue";

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var scrollparent = createCommonjsModule(function (module) {
  (function (root, factory) {
    if (module.exports) {
      module.exports = factory();
    } else {
      root.Scrollparent = factory();
    }
  }(commonjsGlobal, function () {
    var regex = /(auto|scroll)/;

    var parents = function (node, ps) {
      if (node.parentNode === null) { return ps; }

      return parents(node.parentNode, ps.concat([node]));
    };

    var style = function (node, prop) {
      return getComputedStyle(node, null).getPropertyValue(prop);
    };

    var overflow = function (node) {
      return style(node, "overflow") + style(node, "overflow-y") + style(node, "overflow-x");
    };

    var scroll = function (node) {
     return regex.test(overflow(node));
    };

    var scrollParent = function (node) {
      if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
        return ;
      }

      var ps = parents(node.parentNode, []);

      for (var i = 0; i < ps.length; i += 1) {
        if (scroll(ps[i])) {
          return ps[i];
        }
      }

      return document.scrollingElement || document.documentElement;
    };

    return scrollParent;
  }));
  });

  var supportsPassive = false;
  if (typeof window !== 'undefined') {
    supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
          supportsPassive = true;
        }
      });
      window.addEventListener('test', null, opts);
    } catch (e) {}
  }

  // @vue/component
  var Scroller = {
    components: {
      ResizeObserver: script$1
    },
    directives: {
      ObserveVisibility: vueObserveVisibility.ObserveVisibility
    },
    props: {
      items: {
        type: Array,
        required: true
      },
      itemHeight: {
        type: [Number, String],
        default: null
      },
      minItemHeight: {
        type: [Number, String],
        default: null
      },
      heightField: {
        type: String,
        default: 'height'
      },
      typeField: {
        type: String,
        default: 'type'
      },
      buffer: {
        type: [Number, String],
        default: 200
      },
      pageMode: {
        type: Boolean,
        default: false
      },
      prerender: {
        type: [Number, String],
        default: 0
      },
      emitUpdate: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      cssClass: function cssClass() {
        return {
          'page-mode': this.pageMode
        };
      },
      heights: function heights() {
        if (this.itemHeight === null) {
          var heights = {
            '-1': {
              accumulator: 0
            }
          };
          var items = this.items;
          var field = this.heightField;
          var minItemHeight = this.minItemHeight;
          var accumulator = 0;
          var current;
          for (var i = 0, l = items.length; i < l; i++) {
            current = items[i][field] || minItemHeight;
            accumulator += current;
            heights[i] = {
              accumulator: accumulator,
              height: current
            };
          }
          return heights;
        } else {
          return {};
        }
      }
    },
    beforeUnmount: function beforeUnmount() {
      this.removeListeners();
    },
    methods: {
      getListenerTarget: function getListenerTarget() {
        var target = scrollparent(this.$el);
        // Fix global scroll target for Chrome and Safari
        if (target === window.document.documentElement || target === window.document.body) {
          target = window;
        }
        return target;
      },
      getScroll: function getScroll() {
        var el = this.$el;
        var scrollState;
        if (this.pageMode) {
          var rect = el.getBoundingClientRect();
          var top = -rect.top;
          var height = window.innerHeight;
          if (top < 0) {
            height += top;
            top = 0;
          }
          if (top + height > rect.height) {
            height = rect.height - top;
          }
          scrollState = {
            top: top,
            bottom: top + height
          };
        } else {
          scrollState = {
            top: el.scrollTop,
            bottom: el.scrollTop + el.clientHeight
          };
        }
        return scrollState;
      },
      applyPageMode: function applyPageMode() {
        if (this.pageMode) {
          this.addListeners();
        } else {
          this.removeListeners();
        }
      },
      addListeners: function addListeners() {
        this.listenerTarget = this.getListenerTarget();
        this.listenerTarget.addEventListener('scroll', this.handleScroll, supportsPassive ? {
          passive: true
        } : false);
        this.listenerTarget.addEventListener('resize', this.handleResize);
      },
      removeListeners: function removeListeners() {
        if (!this.listenerTarget) {
          return;
        }
        this.listenerTarget.removeEventListener('scroll', this.handleScroll);
        this.listenerTarget.removeEventListener('resize', this.handleResize);
        this.listenerTarget = null;
      },
      scrollToItem: function scrollToItem(index) {
        var scrollTop;
        if (this.itemHeight === null) {
          scrollTop = index > 0 ? this.heights[index - 1].accumulator : 0;
        } else {
          scrollTop = index * this.itemHeight;
        }
        this.scrollToPosition(scrollTop);
      },
      scrollToPosition: function scrollToPosition(position) {
        this.$el.scrollTop = position;
      },
      itemsLimitError: function itemsLimitError() {
        var _this = this;
        setTimeout(function () {
          console.log('It seems the scroller element isn\'t scrolling, so it tries to render all the items at once.', 'Scroller:', _this.$el);
          console.log('Make sure the scroller has a fixed height and \'overflow-y\' set to \'auto\' so it can scroll correctly and only render the items visible in the scroll viewport.');
        });
        throw new Error('Rendered items limit reached');
      }
    }
  };

  var script = {
    name: 'VirtualScroller',

    mixins: [
      Scroller,
    ],

    props: {
      renderers: {
        type: Object,
        default: null,
      },
      keyField: {
        type: String,
        default: 'id',
      },
      mainTag: {
        type: String,
        default: 'div',
      },
      containerTag: {
        type: String,
        default: 'div',
      },
      containerClass: {
        type: [String, Array, Object],
        default: null,
      },
      contentTag: {
        type: String,
        default: 'div',
      },
      contentClass: {
        type: [String, Array, Object],
        default: null,
      },
      poolSize: {
        type: [Number, String],
        default: 2000,
      },
      delayPreviousItems: {
        type: Boolean,
        default: false,
      },
    },

    emits: [
      'resize',
      'visible',
      'hidden',
      'update',
    ],

    data () {
      return {
        visibleItems: [],
        itemContainerStyle: null,
        itemsStyle: null,
        keysEnabled: true,
      }
    },

    watch: {
      items: {
        handler () {
          this.updateVisibleItems(true);
        },
        deep: true,
      },
      pageMode () {
        this.applyPageMode();
        this.updateVisibleItems(true);
      },
      itemHeight: 'setDirty',
    },

    created () {
      this.$_ready = false;
      this.$_startIndex = 0;
      this.$_oldScrollTop = null;
      this.$_oldScrollBottom = null;
      this.$_offsetTop = 0;
      this.$_height = 0;
      this.$_scrollDirty = false;
      this.$_updateDirty = false;

      const prerender = parseInt(this.prerender);
      if (prerender > 0) {
        this.visibleItems = this.items.slice(0, prerender);
        this.$_length = this.visibleItems.length;
        this.$_endIndex = this.$_length - 1;
        this.$_skip = true;
      } else {
        this.$_endIndex = 0;
        this.$_length = 0;
        this.$_skip = false;
      }
    },

    mounted () {
      this.applyPageMode();
      this.$nextTick(() => {
        this.updateVisibleItems(true);
        this.$_ready = true;
      });
    },

    methods: {
      updateVisibleItems (force = false) {
        if (!this.$_updateDirty) {
          this.$_updateDirty = true;
          this.$nextTick(() => {
            this.$_updateDirty = false;

            const l = this.items.length;
            const scroll = this.getScroll();
            const items = this.items;
            const itemHeight = this.itemHeight;
            let containerHeight, offsetTop;
            if (scroll) {
              let startIndex = -1;
              let endIndex = -1;

              const buffer = parseInt(this.buffer);
              const poolSize = parseInt(this.poolSize);
              const scrollTop = ~~(scroll.top / poolSize) * poolSize - buffer;
              const scrollBottom = Math.ceil(scroll.bottom / poolSize) * poolSize + buffer;

              if (!force && ((scrollTop === this.$_oldScrollTop && scrollBottom === this.$_oldScrollBottom) || this.$_skip)) {
                this.$_skip = false;
                return
              } else {
                this.$_oldScrollTop = scrollTop;
                this.$_oldScrollBottom = scrollBottom;
              }

              // Variable height mode
              if (itemHeight === null) {
                const heights = this.heights;
                let h;
                let a = 0;
                let b = l - 1;
                let i = ~~(l / 2);
                let oldI;

                // Searching for startIndex
                do {
                  oldI = i;
                  h = heights[i].accumulator;
                  if (h < scrollTop) {
                    a = i;
                  } else if (i < l - 1 && heights[i + 1].accumulator > scrollTop) {
                    b = i;
                  }
                  i = ~~((a + b) / 2);
                } while (i !== oldI)
                i < 0 && (i = 0);
                startIndex = i;

                // For containers style
                offsetTop = i > 0 ? heights[i - 1].accumulator : 0;
                containerHeight = heights[l - 1].accumulator;

                // Searching for endIndex
                for (endIndex = i; endIndex < l && heights[endIndex].accumulator < scrollBottom; endIndex++);
                if (endIndex === -1) {
                  endIndex = items.length - 1;
                } else {
                  endIndex++;
                  // Bounds
                  endIndex > l && (endIndex = l);
                }
              } else {
                // Fixed height mode
                startIndex = ~~(scrollTop / itemHeight);
                endIndex = Math.ceil(scrollBottom / itemHeight);

                // Bounds
                startIndex < 0 && (startIndex = 0);
                endIndex > l && (endIndex = l);

                offsetTop = startIndex * itemHeight;
                containerHeight = l * itemHeight;
              }

              if (endIndex - startIndex > config.itemsLimit) {
                this.itemsLimitError();
              }

              if (
                force ||
                this.$_startIndex !== startIndex ||
                this.$_endIndex !== endIndex ||
                this.$_offsetTop !== offsetTop ||
                this.$_height !== containerHeight ||
                this.$_length !== l
              ) {
                this.keysEnabled = !(startIndex > this.$_endIndex || endIndex < this.$_startIndex);

                this.itemContainerStyle = {
                  height: containerHeight + 'px',
                };
                this.itemsStyle = {
                  marginTop: offsetTop + 'px',
                };

                if (this.delayPreviousItems) {
                  // Add next items
                  this.visibleItems = items.slice(this.$_startIndex, endIndex);
                  // Remove previous items
                  this.$nextTick(() => {
                    this.visibleItems = items.slice(startIndex, endIndex);
                  });
                } else {
                  this.visibleItems = items.slice(startIndex, endIndex);
                }

                this.emitUpdate && this.$emit('update', startIndex, endIndex);

                this.$_startIndex = startIndex;
                this.$_endIndex = endIndex;
                this.$_length = l;
                this.$_offsetTop = offsetTop;
                this.$_height = containerHeight;
              }
            }
          });
        }
      },

      setDirty () {
        this.$_oldScrollTop = null;
        this.$_oldScrollBottom = null;
      },

      handleScroll () {
        if (!this.$_scrollDirty) {
          this.$_scrollDirty = true;
          requestAnimationFrame(() => {
            this.$_scrollDirty = false;
            this.updateVisibleItems();
          });
        }
      },

      handleResize () {
        this.$emit('resize');
        this.$_ready && this.updateVisibleItems();
      },

      handleVisibilityChange (isVisible, entry) {
        if (this.$_ready && (isVisible || entry.boundingClientRect.width !== 0 || entry.boundingClientRect.height !== 0)) {
          this.$emit('visible');
          this.$nextTick(() => {
            this.updateVisibleItems();
          });
        }
      },
    },
  };

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_resize_observer = vue.resolveComponent("resize-observer");
    const _directive_observe_visibility = vue.resolveDirective("observe-visibility");

    return vue.withDirectives((vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.mainTag), {
      class: vue.normalizeClass([_ctx.cssClass, "virtual-scroller"]),
      onScrollPassive: $options.handleScroll
    }, {
      default: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "before-container"),
        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.containerTag), {
          ref: "itemContainer",
          class: vue.normalizeClass([$props.containerClass, "item-container"]),
          style: vue.normalizeStyle($data.itemContainerStyle)
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "before-content"),
            (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.contentTag), {
              ref: "items",
              class: vue.normalizeClass([$props.contentClass, "items"]),
              style: vue.normalizeStyle($data.itemsStyle)
            }, {
              default: vue.withCtx(() => [
                ($props.renderers)
                  ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList($data.visibleItems, (item, index) => {
                      return (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.renderers[item[_ctx.typeField]]), {
                        key: $data.keysEnabled && item[$props.keyField] || undefined,
                        item: item,
                        "item-index": _ctx.$_startIndex + index,
                        class: "item"
                      }, null, 8 /* PROPS */, ["item", "item-index"]))
                    }), 128 /* KEYED_FRAGMENT */))
                  : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList($data.visibleItems, (item, index) => {
                      return vue.renderSlot(_ctx.$slots, "default", {
                        item: item,
                        itemIndex: _ctx.$_startIndex + index,
                        itemKey: $data.keysEnabled && item[$props.keyField] || undefined,
                        class: "item"
                      })
                    }), 256 /* UNKEYED_FRAGMENT */))
              ]),
              _: 3 /* FORWARDED */
            }, 8 /* PROPS */, ["class", "style"])),
            vue.renderSlot(_ctx.$slots, "after-content")
          ]),
          _: 3 /* FORWARDED */
        }, 8 /* PROPS */, ["class", "style"])),
        vue.renderSlot(_ctx.$slots, "after-container"),
        vue.createVNode(_component_resize_observer, { onNotify: $options.handleResize }, null, 8 /* PROPS */, ["onNotify"])
      ]),
      _: 3 /* FORWARDED */
    }, 40 /* PROPS, HYDRATE_EVENTS */, ["class", "onScrollPassive"])), [
      [_directive_observe_visibility, $options.handleVisibilityChange]
    ])
  }

  script.render = render;
  script.__scopeId = "data-v-727d6836";
  script.__file = "src/components/VirtualScroller.vue";

  function registerComponents(app, prefix) {
    app.component("".concat(prefix, "virtual-scroller"), script);
  }
  var plugin = {
    // eslint-disable-next-line no-undef
    version: "1.1.4",
    install: function install(app, options) {
      var finalOptions = Object.assign({}, {
        installComponents: true,
        componentsPrefix: ''
      }, options);
      for (var key in finalOptions) {
        if (typeof finalOptions[key] !== 'undefined') {
          config[key] = finalOptions[key];
        }
      }
      if (finalOptions.installComponents) {
        registerComponents(app, finalOptions.componentsPrefix);
      }
    }
  };

  exports.VirtualScroller = script;
  exports["default"] = plugin;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=vue-virtual-scroller-classic.umd.js.map
