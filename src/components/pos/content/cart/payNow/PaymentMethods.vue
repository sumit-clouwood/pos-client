<template>
  <div id="payment-method" :class="{ activePayMethod: !payNowCalcHendler }">
    <div
      v-for="(method, key) in methods"
      :key="key"
      :class="{ active: activeMethod == method.name, 'color-secondary': true }"
      @click=";[setMethod(method), methodCardHendlerGhange(method.name)]"
      class="method"
      :data-toggle="getToggle(method)"
      :data-target="getTarget(method)"
    >
      <img :src="image(method.icon)" :alt="method.name" :title="method.name" />
      <label
        class="shorten-sentence text-center color-text-inverse"
        :title="method.name"
      >
        {{ method.name }}
      </label>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import * as CONSTANTS from '@/constants'

export default {
  name: 'PaymentMethods',
  computed: {
    ...mapGetters('payment', ['methods']),
    ...mapGetters(['payNowCalcHendler']),
    ...mapState({
      activeMethod: state => state.checkoutForm.method.name,
    }),
    ...mapState({
      selectedModal: state => state.location.setModal,
    }),
  },
  methods: {
    getToggle(method) {
      if (method.type == CONSTANTS.LOYALTY) {
        return 'modal'
      }
      return ''
    },
    image(imgPath) {
      // return process.env.BASE_URL + imgPath
      if (imgPath) {
        if (imgPath.indexOf('https://') != -1) {
          return imgPath
        } else {
          return process.env.BASE_URL + imgPath
        }
      } else {
        return 'https://fakeimg.pl/46x46/?text=Third&font=lobster%22'
      }
    },
    getTarget(method) {
      if (this.$store.getters['checkoutForm/payable'] > 0) {
        if (method.type == CONSTANTS.LOYALTY) {
          if (this.selectedModal == '#manage-customer') {
            return '#search-loyalty-customer'
          } else {
            this.$store.dispatch('checkoutForm/calculateSpendLoyalty')
            return '#loyalty-payment'
          }
        }
      }
      return ''
    },
    ...mapActions('checkoutForm', ['setMethod']),
    methodCardHendlerGhange(e) {
      this.$store.dispatch('chooseCurentPayMethod', e)
    },
  },
}
</script>
<style lang="scss">
#payment-method {
  display: flex;
  overflow: hidden;
  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  img {
    height: 46px;
  }
}
</style>
