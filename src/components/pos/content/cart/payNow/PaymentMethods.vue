<template>
  <div id="payment-method">
    <div
      v-for="(method, key) in methods"
      :key="key"
      @click="setMethod(method)"
      :data-toggle="getToggle(method)"
      :data-target="getTarget(method)"
    >
      <img :src="method.imagePath + method.image" alt="method.name" /><label>{{
        method.name
      }}</label>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'PaymentMethods',
  data: function() {
    return {
      activeMethod: this.$store.state.checkoutForm.method,
    }
  },
  computed: {
    ...mapGetters('payment', ['methods']),
  },
  methods: {
    getToggle(method) {
      if (method.is_gift) {
        return 'modal'
      }
      return ''
    },

    getTarget(method) {
      if (method.is_gift) {
        return '#Gift-card-payemnt'
      }
      return ''
    },
    ...mapActions('checkoutForm', ['setMethod']),
  },
  updated() {
    $('#payment-method').slick({
      arrows: false,
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      dots: true,
    })
    $('.payment-method-block table td img').click(function() {
      $('.payment-method-block').addClass('active')
      $('.payment-method-block').hide(800)
    })
  },
}
</script>
<style lang="sass" scoped>
img
  height: "46px"
</style>
