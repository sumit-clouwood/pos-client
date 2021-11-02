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
          <i class="arrow right" @click="shiftSlideLeft"></i>
          <i class="arrow left" @click="shiftSlideRight"></i>
          <span v-if="error_payment" class="text-danger-payment"
            >{{ _t('You can not add amount less than 1 or more than') }}&nbsp;
            {{ remainingAmount.amount }}</span
          >
          <form
            v-if="credit_customer_payment === 'custom'"
            class="add-error-class"
          >
            <label for="credit-payment">{{ _t('Please enter amount') }}:</label>
            <input
              type="number"
              autocomplete="off"
              class="form-control input-text"
              v-model="customer_payment_amount"
            />
          </form>
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
              class="button text-button btn btn-danger process-payment"
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
      customer_payment_amount: '',
      error_payment: false,
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
    ...mapState('customer', ['credit_customer_payment']),
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
        let creditPaymentRemaining = false
        let creditPayment = 0
        order.order_payments.forEach(payment => {
          if (
            payment.name === CONST.CUSTOMER_CREDIT &&
            parseFloat(payment.collected) > 0
          ) {
            creditPayment = payment.collected
            creditPaymentRemaining = true
          }
        })
        if (
          order.credit &&
          order.order_system_status === 'normal' &&
          creditPaymentRemaining
        ) {
          amount += parseFloat(creditPayment)
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
        let creditPayment = 0
        order.order_payments.forEach(payment => {
          if (
            payment.name === CONST.CUSTOMER_CREDIT &&
            parseFloat(payment.collected) > 0
          ) {
            creditPayment = payment.collected
          }
        })
        if (
          order.credit &&
          order.order_system_status !== 'cancelled' &&
          creditPayment < 0.01
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
      this.error_payment = false
      $('.add-error-class').removeClass('error')
      $('#credit-payment-methods').attr('style', 'display:none')
    },
    shiftSlideLeft() {
      $('.payment-carosal-customer-slide-button ul').attr(
        'style',
        'transform: translate3d(-400px, 0px, 0px)'
      )
    },
    shiftSlideRight() {
      $('.payment-carosal-customer-slide-button ul').removeAttr('style')
    },
    is_order_paid(order) {
      let creditPaymentRemaining = false
      // let creditPayment = 0
      order.order_payments.forEach(payment => {
        if (
          payment.name === CONST.CUSTOMER_CREDIT &&
          parseFloat(payment.collected) > 0
        ) {
          // creditPayment = payment.collected
          creditPaymentRemaining = true
        }
      })
      if (order.credit && creditPaymentRemaining) {
        return false
      } else return true
    },
    processPayments() {
      this.$store.commit('order/CREDIT_ORDER_PAYMENT', {
        order: false,
        payment_type: this.method,
      })
      // eslint-disable-next-line no-unused-vars
      let creditOrderPayment = this.$store.state.order.creditOrderPayment
      this.error_payment = false
      if (this.customer_payment_amount || creditOrderPayment.order.custom) {
        if (
          parseFloat(this.customer_payment_amount) >
            parseFloat(this.remainingAmount.amount) ||
          parseFloat(this.customer_payment_amount) < 0.01 ||
          isNaN(parseFloat(this.customer_payment_amount))
        ) {
          this.error_payment = true
          $('.add-error-class').addClass('error')
          return false
        }
        $('.add-error-class').removeClass('error')
        this.$store.commit(
          'order/CUSTOM_CREDIT_AMOUNT',
          this.customer_payment_amount
        )
      }
      this.creditOrderPay().then(() => {
        this.msg = 'Order has been paid successfully.'
        this.customer_payment_amount = ''
        this.$store.commit('order/CUSTOM_CREDIT_AMOUNT', 0)
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
.process-payment {
  padding: 10px 40px;
}
.text-danger-payment {
  color: #c40000;
  font-weight: bold;
}
.arrow {
  border: solid #f8f6f6ed;
  border-width: 0 9px 9px 0px;
  display: inline-block;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
}

.right {
  right: 40px;
  bottom: 103px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  position: absolute;
}

.left {
  left: 40px;
  bottom: 100px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  position: absolute;
}
#credit-payment-methods {
  display: none;
  position: absolute;
  top: 21%;
  background: #909090d4;
  padding-top: 5%;
  padding-left: 10%;
  padding-right: 10%;
  padding-bottom: 5%;
  z-index: 1;
  border-radius: 5px;
  box-shadow: 0 0 10px 2px rgba(80, 86, 202, 0.79);
  // left: 100px;
  form {
    &.error {
      color: red;
      border: 1px solid red;
      input {
        color: red;
        border: 1px solid red;
      }
    }
    display: grid;
    grid-template-columns: 1fr 2fr;
    padding: 8px 10px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 3px;
    box-shadow: 0 0 0 1px rgba(80, 86, 202, 0.6);
    label {
      padding-top: 5px;
    }
  }
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
