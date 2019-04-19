<template>
  <div>
    <footer class="sticky-footer">
      <div class="container">
        <ul class="ullist-icons">
          <li data-toggle="modal" data-target="#manage-customer">
            <a href="#">
              <img src="img/pos/customer.svg" alt="customer" />
              <span>Customer</span>
            </a>
          </li>

          <li id="hold-order-box" @click="getHoldOrders">
            <!-- <a href="#"><img class="hold-orders-show" src="images/footer-images/s.png" alt="customer"><img class="hold-order" src="images/hold-order.png" alt="customer"><span>Hold Orders</span></a>-->
            <a href="#"
              ><img class="hold-orders-show" src="img/pos/hold.svg" /><img
                class="hold-ordes"
                src="img/pos/hold-order.svg"
              /><span>Hold Orders</span></a
            >
          </li>
          <li
            data-toggle="modal"
            :data-target="selectedModal"
            data-dismiss="modal"
          >
            <a href="#" @click="setOrderType('delivery')"
              ><img src="img/pos/delivery.svg" /><span
                >Send to Delivery</span
              ></a
            >
          </li>
          <li
            class="active"
            data-toggle="modal"
            data-target="#select-discount"
            id="discount-footer"
          >
            <a href="#" @click.prevent="validateOrderDiscounts()"
              ><img src="img/pos/discount.svg" /><span>Select Discount</span></a
            >
          </li>
          <li data-toggle="modal" data-target="#dining-option">
            <a href="#"
              ><img src="img/pos/dining.svg" /><span>Dinning Options</span></a
            >
          </li>
          <li data-toggle="modal" data-target="#add-note">
            <a href="#"
              ><img src="img/pos/notes.svg" alt="Note" /><span
                >Add Note</span
              ></a
            >
          </li>
          <li
            data-toggle="modal"
            data-target="#search-loyalty-customer"
            v-if="loyaltyEnable"
            :class="{ loyaltyApplied: loyaltyInfo }"
          >
            <a href="#">
              <img src="img/pos/tip.png" alt="Loyalty" v-if="!loyaltyInfo" />
              <span v-if="!loyaltyInfo">Loyalty</span>
              <span v-if="loyaltyInfo">
                <span
                  >{{
                    isNaN(loyaltyInfo.balance)
                      ? 0
                      : parseFloat(loyaltyInfo.balance).toFixed(2)
                  }}
                  {{ loyaltyInfo.currency_code }} Loyalty</span
                >
                <br />
                <span>
                  {{ selectedCustomer.customer_name.substring(0, 28) }}
                </span>
              </span>
            </a>
          </li>
        </ul>
        <ul class="template-btn">
          <li
            v-show="orderType === 'delivery'"
            data-toggle="modal"
            :data-target="selectedModal"
            data-dismiss="modal"
            class="pay-now"
          >
            <a href="#" @click="setOrderType('delivery')"
              ><img src="img/pos/delivery.svg" class="pay-btn" /><span
                >Send to Delivery</span
              ></a
            >
          </li>
          <li id="pay-now" class="pay-now" v-show="orderType !== 'delivery'">
            <a href="#"
              ><img src="img/pos/payment.svg" alt="payment" /><span
                class="pay-btn"
                >Pay Now</span
              ></a
            >
          </li>
        </ul>
      </div>
    </footer>
    <div class="modal-backdrop fade show" id="transparent-screen"></div>

    <!--All popup including online order, because we need to apply few js which are not on header so all popups will be here-->
    <DineIn />
    <AddNote />
    <Discount />
    <OnlineOrder />
    <OnlineOrderDetails />
    <SendToDelivery />
    <ManageCustomer v-if="online" />
    <OfflineManageCustomer v-else />
    <OrderItemPopup />
    <CustomerCreate />
    <CreateCustomerAddress />
    <CartItemDiscount />
    <SelectCustomerAddress />
    <CustomerInformation />
    <CustomerNote />
    <CustomerNotes />
    <CartAddEmail />
    <CartAmountChange />
    <CartPaymentMsg />
    <CartTipAmount />
    <GiftCard />
    <GiftCardInfo />
    <SearchLoyaltyCustomer />
    <Loyalty />
    <Invoice v-show="print" />
  </div>
</template>

<script>
import Invoice from '../pos/content/cart/payNow/Invoice'
import DineIn from './footer/popups/DineIn'
import AddNote from './footer/popups/AddNote'
import Discount from './footer/popups/Discount'
import OnlineOrder from './header/popups/OnlineOrder'
import SendToDelivery from './footer/popups/SendToDelivery'
import ManageCustomer from './footer/popups/ManageCustomer'
import OfflineManageCustomer from './footer/popups/OfflineManageCustomer'
import CartItemDiscount from './footer/popups/CartItemDiscount'
import OrderItemPopup from './content/cart/newOrders/items/Popup'
import CustomerNote from '../pos/footer/popups/ManageCustomer/CustomerNote'
import CustomerCreate from '../pos/footer/popups/ManageCustomer/CustomerCreate'
import CreateCustomerAddress from './footer/popups/ManageCustomer/CustomerAddress/CreateCustomerAddress'
import CartAddEmail from '../pos/content/cart/payNow/popups/AddEmail'
import CartAmountChange from '../pos/content/cart/payNow/popups/AmountChange'
import CartPaymentMsg from '../pos/content/cart/payNow/popups/PaymentMsg'
import CartTipAmount from '../pos/content/cart/payNow/popups/TipAmount'
import CustomerInformation from './footer/popups/ManageCustomer/CustomerInformation'
import CustomerNotes from './footer/popups/ManageCustomer/CustomerInformation/CustomerNotes'
import SelectCustomerAddress from '../pos/footer/popups/ManageCustomer/CustomerAddress/SelectCustomerAddress'
import GiftCard from '../pos/content/cart/newOrders/popup/GiftCard.vue'
import GiftCardInfo from '../pos/content/cart/newOrders/popup/GiftCardInfo.vue'
import SearchLoyaltyCustomer from '../pos/footer/popups/SearchLoyaltyCustomer'
import Loyalty from '../pos/content/cart/newOrders/popup/Loyalty.vue'
import OnlineOrderDetails from './header/popups/OnlineOrderDetails'

import { mapActions, mapState } from 'vuex'
/* global $ */
export default {
  name: 'Footer',
  props: {},
  components: {
    DineIn,
    AddNote,
    Discount,
    OnlineOrderDetails,
    OnlineOrder,
    CustomerNote,
    ManageCustomer,
    OfflineManageCustomer,
    SendToDelivery,
    OrderItemPopup,
    CustomerCreate,
    CreateCustomerAddress,
    CartItemDiscount,
    SelectCustomerAddress,
    CustomerInformation,
    CustomerNotes,
    CartAddEmail,
    CartAmountChange,
    CartPaymentMsg,
    CartTipAmount,
    GiftCard,
    GiftCardInfo,
    SearchLoyaltyCustomer,
    Loyalty,
    Invoice,
  },
  computed: {
    ...mapState('checkout', ['print']),
    ...mapState('order', ['orderType']),
    ...mapState('sync', ['online']),
    ...mapState({
      selectedModal: state =>
        state.location.setModal == '#loyalty-payment'
          ? '#manage-customer'
          : state.location.setModal,
    }),
    ...mapState({
      loyaltyEnable: state => state.loyalty.loyalty,
    }),
    ...mapState({
      loyaltyInfo: state => state.customer.loyalty,
    }),
    ...mapState({
      selectedCustomer: state =>
        typeof state.customer.customer.customer_list != 'undefined'
          ? state.customer.customer.customer_list
          : typeof state.customer.fetchCustomerAddressOnly.customer_list !=
            'undefined'
            ? state.customer.fetchCustomerAddressOnly.customer_list[0]
            : false,
    }),
  },
  methods: {
    ...mapActions('holdOrders', ['getHoldOrders']),
    ...mapActions('discount', ['validateOrderDiscounts']),
    setOrderType(opt) {
      this.$store.commit('order/ORDER_TYPE', opt)
    },
  },
  updated() {
    $('ul.ullist-icons').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      accessibility: false,
      dots: false,
      arrows: true,
      nextArrow: '<img class="next-btn" src="img/pos/next-arrow.png"/>',
      prevArrow: '<img class="back-btn" src="img/pos/back-arrow.png"/>',
    })
  },
}
</script>

<style scoped>
footer.sticky-footer ul.ullist-icons li.loyaltyApplied {
  background: #ff7e28;
  padding: 5px 20px !important;
}

footer.sticky-footer ul.ullist-icons li.loyaltyApplied span {
  font-size: 12px;
  font-weight: bold;
  line-height: 2.1;
  text-align: center;
}
</style>
