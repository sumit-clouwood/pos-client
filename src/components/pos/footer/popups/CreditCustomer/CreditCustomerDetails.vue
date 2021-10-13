<template>
  <div class="container credit-customer-details">
    <hr />
    <progressbar
      v-if="creditCustomerPaymentLoader"
      :init="10"
      :step="10"
      :interval="1"
      :range="100"
    />
    <ul class="nav nav-tabs">
      <li
        :class="{ active: activeTab === 'details' }"
        @click="setActive('details')"
      >
        <a data-toggle="tab" href="#details">{{ _t('Customer Details') }}</a>
      </li>
      <li
        :class="{ active: activeTab === 'remaining_orders_history' }"
        @click="setActive('remaining_orders_history')"
      >
        <a data-toggle="tab" href="#remaining_orders_history">{{
          _t('Remaining Orders')
        }}</a>
      </li>
      <li
        :class="{ active: activeTab === 'paid_order_history' }"
        @click="setActive('paid_order_history')"
      >
        <a data-toggle="tab" href="#paid_order_history">{{
          _t('Paid Orders')
        }}</a>
      </li>
    </ul>

    <div class="tab-content" v-if="customerProfile">
      <div id="details" class="tab-pane fade active show">
        <img
          v-if="customerProfile.image"
          v-bind:src="customerProfile.image_path + customerProfile.image"
          alt="order-profile"
          class="credit-customer-picture"
        />
        <img
          v-else
          class="credit-customer-picture"
          src="https://d3jjfdwi6rnqlf.cloudfront.net/img/other/placeholder-img.png"
        />
        <p class="profile-customer-title color-text-invert">
          {{ _t('Customer Name') }}:
          <b class="text-capitalize">{{ customerProfile.name }}</b>
        </p>
        <p
          class="profile-customer-title color-text"
          v-if="customerProfile.email"
        >
          {{ _t('Email') }}: <b>{{ customerProfile.email }}</b>
        </p>
        <p class="profile-customer-title color-text-invert">
          {{ _t('Phone Number') }}: <b>{{ customerProfile.phone_number }}</b>
        </p>
        <p class="profile-customer-title color-text-invert">
          {{ _t('Pending credit orders') }}:
          <b>{{ remainingAmount.total_pending_credit_orders }}</b>
        </p>
      </div>
      <div id="remaining_orders_history" class="tab-pane fade">
        <span v-if="msg" class="text-success text-capitalize">
          {{ _t(msg) }}
        </span>
        <div v-if="remainingAmount.amount > 0">
          <OrderHistory
            v-for="order in pastOrders"
            :key="order._id"
            :order="order"
            orderType="remaining"
            :payment_status="is_order_paid(order)"
          ></OrderHistory>
        </div>
        <div v-else>
          {{ _t('No order found') }}
        </div>
        <div id="credit-payment-methods">
          <PaymentMethods />
          <div class="actions">
            <div
              class="button text-button btn btn-success process-payment"
              type="button"
              @click="processPayments"
            >
              {{ _t('Pay') }}
            </div>
            <div
              class="button text-button btn btn-danger close-payment"
              type="button"
              @click="hidePayments"
            >
              {{ _t('Close') }}
            </div>
          </div>
        </div>

        <div class="order-history-footer">
          <span>{{ _t('Remaining Balance') }}</span>
          <span> {{ formatPrice(remainingAmount.amount || 0) }}</span>
        </div>
      </div>
      <div id="paid_order_history" class="tab-pane fade">
        <div v-if="paidAmount > 0">
          <OrderHistory
            v-for="order in pastOrders"
            :key="order._id"
            :order="order"
            orderType="paid"
            :payment_status="is_order_paid(order)"
          ></OrderHistory>
        </div>
        <div v-else>
          {{ _t('No order found') }}
        </div>
        <div class="order-history-footer">
          <span>{{ _t('Paid Amount') }}</span>
          <span> {{ formatPrice(paidAmount || 0) }}</span>
        </div>
      </div>
    </div>
    <div class="tab-content" v-else>
      <div id="details" class="tab-pane fade active show">
        {{ _t('No credit order yet') }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import OrderHistory from './OrderHistory'
import * as CONST from '@/constants'
import PaymentMethods from '../../../content/cart/payNow/PaymentMethods'
import progressbar from '@/components/util/progressbar'
/* global $ */
export default {
  name: 'CreditCustomerDetails',
  components: { PaymentMethods, OrderHistory, progressbar },
  data() {
    return {
      activeTab: 'details',
      msg: undefined,
      payment_status: undefined,
    }
  },
  props: {
    customerId: String,
  },
  computed: {
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState({
      customerDetails: state =>
        state.customer.creditCustomerDetails
          ? state.customer.creditCustomerDetails
          : false,
      pastOrders: state => state.customer.creditCustomer,
      creditCustomerPaymentLoader: state =>
        state.order.creditCustomerPaymentLoader,
    }),
    customerProfile() {
      if (this.customerId && this.customerDetails)
        return this.customerDetails._id[this.customerId]
      else return this.customerDetails._id.first()
    },
    ...mapState('checkoutForm', ['method']),
    remainingAmount() {
      let amount = 0
      let total_pending_credit_orders = 0
      if (!this.pastOrders.length) {
        return {
          amount: amount,
          total_pending_credit_orders: total_pending_credit_orders,
        }
      }
      // order.order_system_status === 'normal' &&
      this.pastOrders.forEach(order => {
        if (
          order.credit &&
          order.order_system_status === 'normal' &&
          order.order_payments.length === 1 &&
          order.order_payments[0].name === CONST.CUSTOMER_CREDIT
        ) {
          amount += parseFloat(order.balance_due)
          total_pending_credit_orders += 1
        }
      })
      return {
        amount: amount,
        total_pending_credit_orders: total_pending_credit_orders,
      }
    },
    paidAmount() {
      if (!this.pastOrders.length) {
        return 0
      }
      let amount = 0
      this.pastOrders.forEach(order => {
        if (
          order.credit &&
          order.order_system_status === 'normal' &&
          order.order_payments.length > 1
        ) {
          amount += parseFloat(order.balance_due)
        }
      })
      return amount
    },
  },
  methods: {
    ...mapActions('order', ['selectedOrderDetails', 'creditOrderPay']),
    hidePayments() {
      $('#credit-payment-methods').attr('style', 'display:none')
    },
    is_order_paid(order) {
      if (
        order.credit &&
        order.order_payments.length === 1 &&
        order.order_payments[0].name === CONST.CUSTOMER_CREDIT
      ) {
        return false
      } else return true
    },
    processPayments() {
      this.$store.commit('order/CREDIT_ORDER_PAYMENT', {
        order: false,
        payment_type: this.method,
      })
      this.creditOrderPay().then(() => {
        this.msg = 'Order has been paid successfully.'
        let scope = this
        setTimeout(function() {
          scope.msg = undefined
        }, 3000)
      })
      //   let order_id = this.$store.state.order.creditOrderPayment.order._id
      // $('#credit_customer' + order_id).attr('style', 'display:none')
      $('#credit-payment-methods').attr('style', 'display:none')
    },
    setActive(tab) {
      this.activeTab = tab
    },
  },
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/mixins.scss';
.nav-tabs {
  border-bottom: 1px solid #ddd;
}
.credit-customer-picture {
  width: 15%;
  border-radius: 50%;
}
#details {
  text-align: center;
  .profile-customer-title {
    padding-top: 3px;
  }
}

#credit-payment-methods {
  display: none;
  position: absolute;
  top: 200px;
  background: #90909096;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 10px;
  padding-bottom: 20px;
  // left: 100px;
  .actions {
    position: absolute;
    bottom: 0;
    z-index: 9;
    display: grid;
    right: 4.5%;
    @include responsive(mobile) {
      right: unset;
      left: 4.5%;
    }
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    padding-bottom: 8px;
  }
  @include responsive(mobile) {
    top: unset;
    left: 0;
    bottom: 100px;
  }
}
#remaining_orders_history,
#paid_order_history {
  max-height: 270px;
  overflow-x: scroll;
  min-height: 240px;
  @include responsive(mobile) {
    width: 100%;
    max-height: 170px;
    min-height: 170px;
  }
}
.order-history-footer {
  display: grid;
  grid-template-columns: 2fr auto;
  grid-gap: 10px;
  background: #f3f0f0;
  padding: 11px 15px;
  position: absolute;
  bottom: 15px;
  width: 90%;
  left: 5%;
  color: #353434;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  @include responsive(mobile) {
    width: 84%;
    left: 9%;
  }
}
.nav-tabs > li {
  float: left;
  margin-bottom: -1px;
}
.nav-tabs > li > a {
  padding: 10px;
  margin-right: 2px;
  line-height: 1.43;
  border: 1px solid transparent;
  border-radius: 4px 4px 0 0;
}
.nav-tabs > li > a:hover {
  border-color: #eeeeee #eeeeee #ddd;
}
.nav-tabs > li.active > a,
.nav-tabs > li.active > a:hover,
.nav-tabs > li.active > a:focus {
  color: #555555;
  cursor: default;
  background-color: #fff;
  border: 1px solid #ddd;
  border-bottom-color: transparent;
}
@media (min-width: 768px) {
  .nav-tabs.nav-justified > li {
    display: table-cell;
    width: 1%;
  }
  .nav-tabs.nav-justified > li > a {
    margin-bottom: 0;
  }
}
.nav-tabs.nav-justified > li > a {
  margin-right: 0;
  border-radius: 4px;
}
.nav-tabs.nav-justified > .active > a,
.nav-tabs.nav-justified > .active > a:hover,
.nav-tabs.nav-justified > .active > a:focus {
  border: 1px solid #ddd;
}
@media (min-width: 768px) {
  .nav-tabs.nav-justified > li > a {
    border-bottom: 1px solid #ddd;
    border-radius: 4px 4px 0 0;
  }
  .nav-tabs.nav-justified > .active > a,
  .nav-tabs.nav-justified > .active > a:hover,
  .nav-tabs.nav-justified > .active > a:focus {
    border-bottom-color: #fff;
  }
}
.tab-content > .tab-pane {
  display: none;
}
.tab-content > .active {
  display: block;
}
</style>
