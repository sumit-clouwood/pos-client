import helpers from './helpers'

// This is your plugin object. It can be exported to be used anywhere.
export default {
  // The install method is all that needs to exist on the plugin object.
  // It takes the global Vue object as well as user-defined options.
  //install(Vue, options) {
  install(Vue) {
    // 1. add global method or property
    // Vue.myGlobalMethod = function() {
    //   // some logic ...
    // }

    // // 2. add a global asset
    // Vue.directive('my-directive', {
    //   bind(el, binding, vnode, oldVnode) {
    //     // some logic ...
    //   },
    // })

    // // 3. inject some component options
    // Vue.mixin({
    //   created: function() {
    //     // some logic ...
    //   },
    // })

    // 4. add an instance method

    Vue.prototype.$helper = helpers
  },
}
