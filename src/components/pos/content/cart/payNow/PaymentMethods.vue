<template>
  <div>
    <div id="payment-method" :class="{ activePayMethod: !payNowCalcHendler }">
      <carousel
        :slides="pmethods"
        :perPage="4"
        :width="456"
        @click="selectMethod"
        :data-toggle="getToggle"
        :data-target="getTarget"
      ></carousel>
    </div>
  </div>
</template>

<script>
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
  computed: {
    ...mapState({
      activeMethod: state => state.checkoutForm.method.name,
      selectedModal: state => state.location.setModal,
    }),
    ...mapGetters(['payNowCalcHendler']),
    ...mapGetters({
      pmethods: 'payment/methods',
    }),
  },

  methods: {
    // eslint-disable-next-line no-unused-vars
    selectMethod({ index, slide }) {
      this.setMethod(slide), this.methodCardHendlerChange(slide.priority)
      this.getToggle = ''
      if (slide.type == CONSTANTS.LOYALTY) {
        this.getToggle = 'modal'
      }

      if (this.$store.getters['checkoutForm/payable'] > 0) {
        if (slide.type == CONSTANTS.LOYALTY) {
          if (this.selectedModal == '#manage-customer') {
            this.getTarget = '#search-loyalty-customer'
          } else {
            this.$store.dispatch('checkoutForm/calculateSpendLoyalty')
            this.getTarget = '#loyalty-payment'
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
#payment-method {
  width: 456px;

  img {
    height: 46px;
  }
}
</style>
