<template>
  <div class="main-orders-contacts color-text">
    <div class="main-oreders-title">
      {{ cartType == 'hold' ? _t('Hold Orders') : _t('New Orders') }}
      <DateTimeVue />
    </div>
    <div class="main-oreders-email" v-if="selectedCustomer && online">
      <span class="cursor-pointer color-text" @click="removeSelectedCustomer()">
        X
      </span>
      <p v-if="selectedCustomer.name != ''">
        {{ _t('Name') }} : {{ selectedCustomer.name }}
      </p>
      <div v-if="selectedCustomer.phone_number">
        {{ _t('Phone') }} : {{ selectedCustomer.phone_number }}
      </div>
    </div>
    <div class="main-oreders-email" v-if="offlineCustomer && !online">
      <span class="cursor-pointer color-text" @click="removeSelectedCustomer()">
        X
      </span>
      <p v-if="offlineCustomer.name != ''">
        {{ _t('Name') }} : {{ offlineCustomer.name }}
      </p>
      <div v-if="offlineCustomer.phone_number">
        {{ _t('Phone') }} : {{ offlineCustomer.phone_number }}
      </div>
    </div>
    <div class="main-oreders-buttons" v-if="items.length">
      <!--<div class="orders-button-large" disabled="disable">
        {{ _t('Move Table') }}
      </div>
      <div class="orders-button-large" disabled="disable">
        {{ _t('Split Table') }}
      </div>-->
      <div
        v-if="
          cartType !== 'hold' && orderType.OTApi !== CONST.ORDER_TYPE_CARHOP
        "
        class="orders-button-large color-main color-text"
        @click="hold"
      >
        {{ _t('Hold') }}
      </div>
      <div>
        <div
          class="btn btn-success cartBottomBtn"
          @click="scroll('up')"
          :class="{ visible: showScrollDown }"
        >
          <i aria-hidden="true" class="fa fa-chevron-down"></i>
        </div>
        <div
          class="btn btn-success cartBottomBtn  down"
          @click="scroll('down')"
          :class="{ visible: showScrollUp }"
        >
          <i aria-hidden="true" class="fa fa-chevron-down"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '@/eventBus'
import CheckoutMixin from '@/mixins/Checkout'

import { mapState, mapGetters, mapActions } from 'vuex'
import DateTimeVue from '@/components/util/DateTimeVue'
export default {
  name: 'Header',
  mixins: [CheckoutMixin],
  props: {},
  data() {
    return {
      showScrollUp: false,
      showScrollDown: false,
    }
  },
  components: {
    DateTimeVue,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['items', 'cartType', 'orderType']),
    ...mapState('checkoutForm', ['msg']),
    ...mapState({ selectedCustomer: state => state.customer.customer }),
    ...mapState({ offlineCustomer: state => state.customer.offlineData }),
    ...mapState('sync', ['online']),
  },
  mounted() {
    bus.$on('showScrollCartUp', option => {
      this.showScrollUp = option
    })
    bus.$on('showScrollCartDown', option => {
      this.showScrollDown = option
    })
  },
  methods: {
    scroll(option) {
      bus.$emit('scroll-cart', option)
    },
    removeSelectedCustomer() {
      this.$store.commit('location/SET_MODAL', '#manage-customer')
      this.$store.dispatch('customer/resetCustomer')
    },

    hold() {
      this.executePayment({ action: 'on-hold' })
    },
    ...mapActions('checkout', ['orderOnHold']),
  },
}
</script>
<style lang="sass" scoped>
.cartBottomBtn
  opacity: 0

  &.visible
    opacity: 1
  &.down
    margin-left: 10px
    -ms-transform: rotate(180deg)
    transform: rotate(180deg)

.hide
  display : none
  .cartBottomBtn
    width: 50px
    -ms-transform: rotate(90deg)
    transform: rotate(90deg)
</style>
