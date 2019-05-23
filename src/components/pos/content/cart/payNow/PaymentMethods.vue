<template>
  <div id="payment-method">
    <carousel :per-page="4" :mouse-drag="true">
      <slide
        v-for="(method, key) in methods"
        :key="key"
        :class="{ active: activeMethod == method.name }"
        @click="setMethod(method)"
      >
        <img :src="getImage(method.icon)" alt="method.name" /><br /><label>{{
          method.name
        }}</label>
      </slide>
    </carousel>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { Carousel, Slide } from 'vue-carousel'
import * as CONSTANTS from '@/constants'

export default {
  name: 'PaymentMethods',
  components: { Carousel, Slide },
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
    getImage() {
      //fake image for now
      return 'https://fakeimg.pl/80x80/?text=PaymentMethod&font=lobster%22'
    },
    getToggle(method) {
      if (method.name == CONSTANTS.LOYALTY) {
        return 'modal'
      }
      return ''
    },

    getTarget(method) {
      if (method.name == CONSTANTS.LOYALTY) {
        if (this.selectedModal == '#manage-customer') {
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
}
</script>
<style lang="sass" scoped>
img
  height: 80px
</style>
