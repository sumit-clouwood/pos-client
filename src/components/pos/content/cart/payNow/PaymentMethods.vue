<template>
  <div>
    <div id="payment-method" :class="{ activePayMethod: !payNowCalcHendler }">
      <carousel
        ref="paymentmethods"
        :slides="methods"
        :perPage="4"
        :width="456"
        @click="selectMethod"
      ></carousel>
    </div>
  </div>
</template>

<script>
/* global $, showModal */
import { mapActions, mapGetters, mapState } from 'vuex'
import * as CONSTANTS from '@/constants'
import Carousel from '@/components/util/Carousel.vue'

export default {
  name: 'PaymentMethods',
  components: {
    Carousel,
  },

  data() {
    return {
      jqInit: false,
      getToggle: '',
      getTarget: '',
    }
  },
  watch: {
    forceCash(newVal) {
      if (newVal) {
        this.$refs.paymentmethods.setActive(CONSTANTS.CASH)
        this.$store.commit('checkoutForm/forceCash', false)
      }
    },
    payable(newval) {
      if (!newval) {
        //this method ll call the forcash inside
        this.$store.dispatch('checkoutForm/setCashMethod')
      }
    },
  },
  computed: {
    ...mapState({
      activeMethod: state => state.checkoutForm.method.name,
      forceCash: state => state.checkoutForm.forceCash,
      selectedModal: state => state.location.setModal,
    }),
    ...mapGetters(['payNowCalcHendler']),
    ...mapGetters({
      payable: 'checkoutForm/payable',
    }),
    ...mapState('payment', ['methods']),
  },

  methods: {
    // eslint-disable-next-line no-unused-vars
    selectMethod({ index, slide }) {
      //const event = window.event
      //event.preventDefault()
      if (!$.isEmptyObject(slide)) this.setMethod(slide)
      else this.$store.commit('checkoutForm/forceCash', true)
      this.methodCardHendlerChange(slide.priority)

      if (this.$store.getters['checkoutForm/payable'] > 0) {
        if (slide.type == CONSTANTS.LOYALTY) {
          if (this.selectedModal == '#manage-customer') {
            showModal('#search-loyalty-customer')
          } else {
            this.$store.dispatch('checkoutForm/calculateSpendLoyalty')
            showModal('#loyalty-payment')
          }
        }
      }
      return ''
    },

    image(imgPath) {
      return imgPath
    },
    ...mapActions('checkoutForm', ['setMethod']),
    methodCardHendlerChange(e) {
      this.$store.dispatch('chooseCurentPayMethod', e)
    },
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

#payment-method {
  width: 456px;

  img {
    height: 46px;
  }
}
@include responsive(mobile) {
  .mobile-payment-methods
    .pay-body
    #payment-method
    .carousel-container
    .carousel {
    overflow-y: scroll;
    height: 40vh;
  }
}
</style>
