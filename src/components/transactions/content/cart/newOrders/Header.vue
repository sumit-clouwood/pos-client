<template>
  <div class="transaction-cart" v-if="order">
    <div class="transaction-payment">
      <div class="trans-cash-payment">
        <p>{{ created_date_time(order) }}</p>
      </div>
      <div class="trans-cash-price">
        <p>
          <span>{{ _t('Sale') }}</span> {{ order.currency }}
          {{ order.balance_due }}
        </p>
      </div>
    </div>
    <div
      class="transaction-payment"
      v-for="(payment, index) in order.order_payments"
      :key="index"
    >
      <div class="trans-cash-payment">
        <p class="trans-label">{{ payment.name }}</p>
      </div>
      <div class="trans-cash-price">
        <p class="trans-cash-recipt">{{ formatPrice(payment.param2 || 0) }}</p>
      </div>
    </div>
    <div class="transaction-payment">
      <div class="trans-cash-payment">
        <p class="trans-label">{{ _t('Receipt') }}</p>
      </div>
      <div class="trans-cash-price">
        <p class="trans-cash-recipt">
          {{
            order.order_type.replace(/[_-]/g, ' ').replace(/^./, function(t) {
              return t.toUpperCase()
            })
          }}
          #{{ order.order_no }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// import moment from 'moment-timezone'
import { mapState, mapGetters } from 'vuex'
import DateTime from '@/mixins/DateTime'

export default {
  name: 'Header',
  props: {
    order: Object,
  },
  mixins: [DateTime],
  computed: {
    ...mapGetters('location', ['formatPrice', '_t', 'timezoneString']),
    ...mapState('order', ['items', 'cartType']),
    ...mapState('checkoutForm', ['msg']),
    ...mapState({ selectedCustomer: state => state.customer.customer }),
  },
  methods: {
    // moment: function(date) {
    //   moment.tz.setDefault(this.$store.state.location.setTimeZone)
    //   return moment(date).format('dddd, LL h:mm a')
    // },
    created_date_time(order) {
      if (order.future_order_datetime) {
        return this.convertDatetime(
          order.future_order_datetime,
          this.timezoneString,
          'dddd, LL h:mm a'
        )
      }
      return this.convertDatetime(
        order.real_created_datetime,
        this.timezoneString,
        'dddd, LL h:mm a'
      )
    },
    removeSelectedCustomer() {
      this.$store.commit('location/SET_MODAL', '#manage-customer')
      this.$store.dispatch('customer/resetCustomer')
    },
  },
}
</script>
<style lang="sass" scoped>
.hide
  display : none
</style>
