<template>
  <div>
    <div
      v-if="order.credit && !payment_status && orderType === 'remaining'"
      class="order-history-data"
      :id="'credit_customer' + order._id"
    >
      <div class="invoice-date">
        <span
          data-toggle="modal"
          data-target=".bd-example-modal-lg"
          data-dismiss="modal"
          @click="selectedOrderDetails(order._id)"
          class="cursor-pointer text-capitalize"
        >
          <b>#{{ order.order_no }}</b>
          {{ LookupData.replaceUnderscoreHyphon(order.order_type) }}
        </span>
        <span>
          {{ _t('Date') }}:<b> {{ created_date_time(order) }}</b>
        </span>
      </div>
      <div>
        <b> {{ formatPrice(order.balance_due) }}</b>
      </div>
      <div
        class="button text-button btn btn-success"
        type="button"
        @click="payCreditOrder(order)"
      >
        {{ _t('Pay') }}
      </div>
    </div>
    <div
      v-if="order.credit && payment_status && orderType === 'paid'"
      class="order-history-data"
      :id="order._id"
    >
      <div class="invoice-date">
        <span
          data-toggle="modal"
          data-target=".bd-example-modal-lg"
          data-dismiss="modal"
          @click="selectedOrderDetails(order._id)"
          class="cursor-pointer text-capitalize"
        >
          <b>#{{ order.order_no }}</b>
          {{ LookupData.replaceUnderscoreHyphon(order.order_type) }}
        </span>
        <span>
          {{ _t('Date') }}:<b> {{ created_date_time(order) }}</b>
        </span>
      </div>
      <div>
        <b> {{ formatPrice(order.balance_due) }}</b>
      </div>
      <div class="paid-amount-msg text-left font-weight-bold">
        <img
          src="https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/paid-icon.png"
          style="width:33px"
        />
        {{ _t('Paid') }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import DateTime from '@/mixins/DateTime'

/* global $ */
export default {
  name: 'OrderHistory',
  mixins: [DateTime],

  data() {
    return {
      /*active_id: '',*/
    }
  },
  props: {
    order: Object,
    orderType: String,
    payment_status: Boolean,
  },
  computed: {
    ...mapState('location', ['timezoneString']),
    ...mapGetters('location', ['formatPrice', '_t']),
  },
  methods: {
    created_date_time(order) {
      if (order.future_order_datetime) {
        return this.convertDatetime(
          order.future_order_datetime,
          this.timezoneString,
          'Do MMM YYYY h:mm:ss A'
        )
      }
      return this.convertDatetime(
        order.real_created_datetime,
        this.timezoneString,
        'Do MMM YYYY h:mm:ss A'
      )
    },
    ...mapActions('order', ['selectedOrderDetails']),
    // eslint-disable-next-line no-unused-vars
    payCreditOrder(order) {
      // this.$store.commit('payment/PAYMENT_SLIDES_PER_PAGE', 3)
      this.$store.commit('order/CREDIT_ORDER_PAYMENT', {
        order: order,
        payment_type: false,
      })
      $('.order-history-data.active').removeClass('active')
      $('#credit_customer' + order._id).addClass('active')
      $('#credit-payment-methods').attr('style', 'display:block')
    },
  },
}
</script>
<style scoped lang="scss">
.order-history-data {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  grid-gap: 10px;
  background: #f9f9f9;
  border: 1px dashed gray;
  align-items: baseline;
  margin-bottom: 5px;
  padding: 5px 15px;
  .invoice-date {
    display: grid;
    grid-column-gap: 10px;
    grid-template-columns: 43% 1fr;
  }
}
#remaining_orders_history {
  .active {
    background: #676767;
    color: #fff;
  }
}
</style>
