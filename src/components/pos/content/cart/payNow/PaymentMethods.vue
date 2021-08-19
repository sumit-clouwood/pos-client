<template>
  <div>
    <div id="payment-method" :class="{ activePayMethod: !payNowCalcHendler }">
      <carousel
        ref="paymentmethods"
        :slides="methods"
        :perPage="4"
        :width="400"
        @click="selectMethod"
      ></carousel>
    </div>
    <template v-for="(method, index) in methods">
      <link
        v-for="(entry, key) in method"
        rel="prefetch"
        :href="entry.icon"
        :key="key + index"
      />
    </template>
    <link
      rel="prefetch"
      href="https://d3jjfdwi6rnqlf.cloudfront.net/img/icons/backarrow.svg"
    />
    <link
      rel="prefetch"
      href="https://d3jjfdwi6rnqlf.cloudfront.net/img/icons/svgs/aggregator.svg"
    />
  </div>
</template>

<script>
/* global $, showModal */
import { mapActions, mapGetters, mapState } from 'vuex'
import * as CONST from '@/constants'
import Carousel from '@/components/util/Carousel.vue'
import { bus } from '@/eventBus'
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
        this.$refs.paymentmethods.setActive(CONST.CASH)
        this.$refs.paymentmethods.movePage(1)
        this.$refs.paymentmethods.show = false
        this.$refs.paymentmethods.showAggregator = false
        this.$store.commit('checkoutForm/forceCash', false)
        bus.$emit('resetChildSlider')
      }
    },
    payable(newval) {
      if (!newval) {
        //this method ll call the forcash inside
        if (!this.orderTotal) {
          this.$store.dispatch('checkoutForm/setCashMethod')
        }
      }
    },
  },
  computed: {
    ...mapState({ selectedCustomer: state => state.customer.customer }),
    ...mapState({
      activeMethod: state => state.checkoutForm.method.name,
      payments: state => state.checkoutForm.payments,
      forceCash: state => state.checkoutForm.forceCash,
      selectedModal: state => state.location.setModal,
      loyaltyCard: state => state.customer.customerLoyalty.card,
    }),
    ...mapGetters('location', ['_t']),
    ...mapGetters('payment', ['cash']),
    ...mapState('sync', ['online']),
    ...mapGetters(['payNowCalcHendler']),
    ...mapGetters({
      payable: 'checkoutForm/payable',
      orderTotal: 'checkoutForm/orderTotal',
    }),
    ...mapState('payment', ['methods']),
  },

  methods: {
    imagePath(key) {
      return 'img/icons/svgs/' + key + '.svg'
    },
    // eslint-disable-next-line no-unused-vars
    selectMethod({ index, slide }) {
      //const event = window.event
      //event.preventDefault()
      //Method is called when payment method is selected
      if (!$.isEmptyObject(slide)) {
        if (this.payments.length > 0 && slide.type === CONST.AGGREGATOR) {
          // Paying partially using Aggregator, Don't allow
          this.$store.commit('checkoutForm/forceCash', true)
          this.setErrorMessage()
        } else if (this.payments) {
          //if there are already any method added, check if it Aggregator or not
          let index = this.payments.findIndex(
            payment => payment.method.type === CONST.AGGREGATOR
          )
          if (index == -1) {
            this.setMethod(slide)
          } else {
            this.setErrorMessage()
          }
        } else {
          this.$refs.paymentmethods.setActive(CONST.AGGREGATOR)
        }
      } else {
        // eslint-disable-next-line no-debugger
        debugger
        let index = this.payments.findIndex(
          payment => payment.method.type === CONST.AGGREGATOR
        )
        // If aggregator type is not already selected, then set force cash method
        if (index == -1) {
          this.$store.commit('checkoutForm/forceCash', true)
        }
        if (index == '' && this.method.type === CONST.AGGREGATOR) {
          this.$refs.carousel.currentSlide = CONST.AGGREGATOR
        }
        this.$refs.paymentmethods.showAggregator = false
      }
      this.methodCardHendlerChange(slide.priority)

      if (this.$store.getters['checkoutForm/payable'] > 0) {
        if (slide.type == CONST.CUSTOMER_CREDIT_TYPE) {
          if (!this.selectedCustomer) {
            this.setErrorMessage(
              'Credit customer payment',
              'Please select customer for credit payment.'
            )
            this.$store.commit('checkoutForm/setMethod', this.cash, {
              root: true,
            })
          }
        }
        if (slide.type == CONST.LOYALTY) {
          if (this.online) {
            if (this.selectedModal == '#manage-customer') {
              showModal('#search-loyalty-customer')
            } else {
              this.$store.dispatch('checkoutForm/calculateLoyaltyAmountForItem')
              // this.$store.dispatch('checkoutForm/calculateSpendLoyalty')
              // showModal('#loyalty-payment')
              // added loyalty direct
            }
          } else {
            this.setErrorMessage(
              'Check your network connection',
              'Loyalty will not work on offline mode'
            )
          }
        }
      }
      return ''
    },
    setErrorMessage(
      title = 'Partial Payment error',
      msg = 'Partial Payments not allowed for Aggregator types'
    ) {
      this.$store.commit('order/setAlert', {
        type: 'error',
        title: this._t(title),
        msg: this._t(msg),
      })
      $('#alert-popup').modal('show')
      this.$store.commit('checkoutForm/forceCash', true)
      this.$refs.paymentmethods.movePage(1)
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
    overflow-y: scroll !important;
    height: 65vh;
  }
}
</style>
