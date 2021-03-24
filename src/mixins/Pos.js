/* global Eventer */

import Payment from '../plugins/helpers/Payment'

/* eslint-disable no-console */
export default {
  methods: {},
  mounted() {
    //pos mixin mounted called
    let self = this
    const input = document.getElementById('ios_scale_value')

    const descriptor = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(input),
      'value'
    )

    Object.defineProperty(input, 'value', {
      set: function(data) {
        self.$store.dispatch('category/setScaleData', data)
        return descriptor.set.apply(this, arguments)
      },
      get: function() {
        return descriptor.get.apply(this)
      },
    })

    Eventer.on(
      'paysky',
      (data, event, context) => {
        Payment.exec(this.$store, event, data, context)
      },
      'checkout'
    )
  },
  created() {},
}
