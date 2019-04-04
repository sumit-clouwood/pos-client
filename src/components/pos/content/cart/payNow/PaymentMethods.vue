<template>
  <div id="payment-method">
    <div
      v-for="(method, key) in methods"
      :key="key"
      :class="{ active: activeMethod == method.name }"
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
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'PaymentMethods',
  computed: {
    ...mapGetters('payment', ['methods']),
    ...mapState({
      activeMethod: state => state.checkoutForm.method.name,
    }),
    ...mapState({
      selectedModal: state => state.location.setModal,
    }),
  },
  methods: {
    getToggle(method) {
      if (method.is_gift || method.name == 'Loyalty') {
        return 'modal'
      }
      return ''
    },

    getTarget(method) {
      if (method.is_gift) {
        return '#Gift-card-payemnt'
      } else if(method.name == 'Loyalty') {
        if(this.selectedModal == '#manage-customer' ) {
          return '#search-loyalty-customer'
        } else {
          this.$store.dispatch('checkoutForm/calculateSpendLoyalty')
          return '#loyalty-payment'
        }
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
      if ($('.payment-method-block').length) {
        $('.payment-method-block').addClass('active')
        $('.payment-method-block').hide(800)
      }
    })
  },
}
</script>
<style lang="sass" scoped>
img
  height: "46px"
</style>
