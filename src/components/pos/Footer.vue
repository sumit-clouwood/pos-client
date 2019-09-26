<template>
  <div class="footer">
    <div class="footer-slider color-dashboard-background">
      <ul class="footer-slider-list ullist-icons">
        <li
          class="footer-slider-list-item color-secondary"
          data-toggle="modal"
          data-target="#manage-customer"
        >
          <a
            class="footer-slider-list-item-link color-text-invert"
            role="button"
          >
            <!--<img src="images/footer-images/user.svg" alt="customer">-->
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="user"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="svg-inline--fa fa-user fa-w-14 fa-2x"
            >
              <path
                fill="currentColor"
                d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                class
              ></path>
            </svg>
            <span>{{ _t('Customer') }}</span>
          </a>
        </li>
        <li
          v-if="cartType === 'new' && orderType.OTApi !== 'dine_in'"
          @click="viewHoldOrders"
          class="footer-slider-list-item footer-slider-list-item-open-orders color-secondary"
          :class="{ active: vbutton === 'hold' }"
          id="hold-order-box"
        >
          <a
            class="footer-slider-list-item-link color-text-invert"
            role="button"
          >
            <!--<img class="hold-ordes" src="images/hold-order.png" alt="customer">-->
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="play"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="svg-inline--fa fa-play fa-w-14 fa-2x"
            >
              <path
                fill="currentColor"
                d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
                class
              ></path>
            </svg>
            <span>{{ _t('Hold Orders') }}</span>
          </a>
        </li>
        <li
          v-else
          @click="newOrders"
          class="footer-slider-list-item footer-slider-list-item-open-orders color-secondary"
          :class="{
            active: vbutton === 'new',
            hide: orderType.OTApi === 'dine_in',
          }"
          id="new-order-box"
        >
          <a
            class="footer-slider-list-item-link color-text-invert"
            role="button"
          >
            <!--<img class="hold-ordes" src="images/hold-order.png" alt="customer">-->
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="play"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="svg-inline--fa fa-play fa-w-14 fa-2x"
            >
              <path
                fill="currentColor"
                d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
                class=""
              ></path>
            </svg>
            <span>{{ _t('New Orders') }}</span>
          </a>
        </li>
        <li
          data-toggle="modal"
          data-target="#search-loyalty-customer"
          class="footer-slider-list-item color-secondary"
          :class="{ loyaltyApplied: loyaltyCard }"
        >
          <a
            role="button"
            class="footer-slider-list-item-link color-text-invert"
          >
            <img
              src="img/pos/loyalty.svg"
              :alt="_t('Loyalty')"
              v-if="!loyaltyCard"
            />
            <span v-if="!loyaltyCard">{{ _t('Loyalty') }}</span>
            <span v-if="loyaltyCard">
              <span>
                {{
                  isNaN(loyaltyCard.balance)
                    ? 0
                    : formatPrice(loyaltyCard.balance)
                }}
                {{ _t('Loyalty') }}</span
              >
              <br />
              <span class="shorten-sentence">
                {{ selectedCustomer }}
              </span>
              <!--<br />
              <span>{{ selectedCustomer }}</span>-->
            </span>
          </a>
        </li>
        <li
          class="footer-slider-list-item color-secondary"
          data-toggle="modal"
          data-dismiss="modal"
          @click="add_customer_address"
        >
          <!--<a
            class="footer-slider-list-item-link"
            role="button"
            @click="setOrderType({ OTview: 'Delivery', OTApi: 'call_center' })"
          >-->
          <a
            class="footer-slider-list-item-link color-text-invert"
            role="button"
          >
            <!--<img src="images/footer-images/d_2.png" alt="customer">-->
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="suitcase"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="svg-inline--fa fa-suitcase fa-w-16 fa-2x"
            >
              <path
                fill="currentColor"
                d="M128 480h256V80c0-26.5-21.5-48-48-48H176c-26.5 0-48 21.5-48 48v400zm64-384h128v32H192V96zm320 80v256c0 26.5-21.5 48-48 48h-48V128h48c26.5 0 48 21.5 48 48zM96 480H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h48v352z"
                class
              ></path>
            </svg>
            <span>{{ _t('Send to Delivery') }}</span>
          </a>
        </li>
        <li
          class="footer-slider-list-item color-secondary active"
          data-toggle="modal"
          data-target="#select-discount"
          id="discount-footer"
        >
          <a
            class="footer-slider-list-item-link color-text-invert"
            role="button"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="badge-percent"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="svg-inline--fa fa-badge-percent fa-w-16 fa-2x"
            >
              <path
                fill="currentColor"
                d="M512 256c0-37.7-23.7-69.9-57.1-82.4 14.7-32.4 8.8-71.9-17.9-98.6-26.7-26.7-66.2-32.6-98.6-17.9C325.9 23.7 293.7 0 256 0s-69.9 23.7-82.4 57.1c-32.4-14.7-72-8.8-98.6 17.9-26.7 26.7-32.6 66.2-17.9 98.6C23.7 186.1 0 218.3 0 256s23.7 69.9 57.1 82.4c-14.7 32.4-8.8 72 17.9 98.6 26.6 26.6 66.1 32.7 98.6 17.9 12.5 33.3 44.7 57.1 82.4 57.1s69.9-23.7 82.4-57.1c32.6 14.8 72 8.7 98.6-17.9 26.7-26.7 32.6-66.2 17.9-98.6 33.4-12.5 57.1-44.7 57.1-82.4zm-320-96c17.67 0 32 14.33 32 32s-14.33 32-32 32-32-14.33-32-32 14.33-32 32-32zm12.28 181.65c-6.25 6.25-16.38 6.25-22.63 0l-11.31-11.31c-6.25-6.25-6.25-16.38 0-22.63l137.37-137.37c6.25-6.25 16.38-6.25 22.63 0l11.31 11.31c6.25 6.25 6.25 16.38 0 22.63L204.28 341.65zM320 352c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"
                class
              ></path>
            </svg>
            <span>{{ _t('Select') + ' ' + _t('Discount') }}</span>
          </a>
        </li>
        <li
          class="footer-slider-list-item color-secondary"
          data-toggle="modal"
          data-target="#dining-option"
        >
          <a
            class="footer-slider-list-item-link color-text-invert"
            role="button"
          >
            <!--<img src="images/footer-images/group_9.png" alt="customer">-->
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="utensils"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 416 512"
              class="svg-inline--fa fa-utensils fa-w-13 fa-2x"
            >
              <path
                fill="currentColor"
                d="M207.9 15.2c.8 4.7 16.1 94.5 16.1 128.8 0 52.3-27.8 89.6-68.9 104.6L168 486.7c.7 13.7-10.2 25.3-24 25.3H80c-13.7 0-24.7-11.5-24-25.3l12.9-238.1C27.7 233.6 0 196.2 0 144 0 109.6 15.3 19.9 16.1 15.2 19.3-5.1 61.4-5.4 64 16.3v141.2c1.3 3.4 15.1 3.2 16 0 1.4-25.3 7.9-139.2 8-141.8 3.3-20.8 44.7-20.8 47.9 0 .2 2.7 6.6 116.5 8 141.8.9 3.2 14.8 3.4 16 0V16.3c2.6-21.6 44.8-21.4 48-1.1zm119.2 285.7l-15 185.1c-1.2 14 9.9 26 23.9 26h56c13.3 0 24-10.7 24-24V24c0-13.2-10.7-24-24-24-82.5 0-221.4 178.5-64.9 300.9z"
                class
              ></path>
            </svg>
            <span>{{ _t('Dinning Options') }}</span>
          </a>
        </li>
        <li
          class="footer-slider-list-item color-secondary"
          data-toggle="modal"
          data-target="#add-note"
        >
          <a
            class="footer-slider-list-item-link color-text-invert"
            role="button"
          >
            <!--<img src="images/footer-images/a.png" alt="customer">-->
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="pen-square"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="svg-inline--fa fa-pen-square fa-w-14 fa-2x"
            >
              <path
                fill="currentColor"
                d="M400 480H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zM238.1 177.9L102.4 313.6l-6.3 57.1c-.8 7.6 5.6 14.1 13.3 13.3l57.1-6.3L302.2 242c2.3-2.3 2.3-6.1 0-8.5L246.7 178c-2.5-2.4-6.3-2.4-8.6-.1zM345 165.1L314.9 135c-9.4-9.4-24.6-9.4-33.9 0l-23.1 23.1c-2.3 2.3-2.3 6.1 0 8.5l55.5 55.5c2.3 2.3 6.1 2.3 8.5 0L345 199c9.3-9.3 9.3-24.5 0-33.9z"
                class
              ></path>
            </svg>
            <span>{{ _t('Add Note') }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div
      class="footer-buttons color-dashboard-background"
      :style="
        orderType.OTApi === 'dine_in' ? 'grid-template-columns: 1fr 1fr' : ''
      "
    >
      <div class="button" v-if="is_pay === 1">
        <ul class="template-btn">
          <li
            v-show="orderType.OTApi === 'call_center'"
            class="footer-slider-list-item color-secondary"
            data-toggle="modal"
            :data-target="selectedModal"
            data-dismiss="modal"
          >
            <a
              class="footer-slider-list-item-link color-text-invert"
              role="button"
              @click="
                setOrderType({ OTview: 'Delivery', OTApi: 'call_center' })
              "
            >
              <!--<img src="images/footer-images/d_2.png" alt="customer">-->
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="suitcase"
                role="img"
                width="1.875rem"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa fa-suitcase fa-w-16 fa-2x"
              >
                <path
                  fill="currentColor"
                  d="M128 480h256V80c0-26.5-21.5-48-48-48H176c-26.5 0-48 21.5-48 48v400zm64-384h128v32H192V96zm320 80v256c0 26.5-21.5 48-48 48h-48V128h48c26.5 0 48 21.5 48 48zM96 480H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h48v352z"
                  class
                ></path>
              </svg>
              <span>{{ _t('Send to Delivery') }}</span>
            </a>
          </li>
          <li
            class="pay-now color-dashboard-background color-main"
            v-show="orderType.OTApi !== 'call_center'"
            @click="payNowClick()"
          >
            <a role="button">
              <img src="img/pos/payment.svg" :alt="_t('Pay Now')" />
              <span class="pay-btn color-text-invert">{{ _t('Pay Now') }}</span>
            </a>
          </li>
        </ul>
      </div>
      <div
        class="button"
        v-show="orderType.OTApi === 'dine_in' || is_pay === 0"
      >
        <ul class="template-btn">
          <li
            class="pay-now color-dashboard-background color-main"
            @click="payNowDirect()"
          >
            <a role="button">
              <img src="img/pos/payment.svg" :alt="_t('Place Order')" />
              <span class="pay-btn color-text-invert">
                {{ _t('Place Order') }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>

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
    <Card />
    <GiftCardInfo />
    <SearchLoyaltyCustomer />
    <Loyalty />
    <Invoice />
    <OrderDetailsPopup />
    <UserProfile />
    <InformationPopup :responseInformation="this.message" :title="this.title" />
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
import Card from '../pos/content/cart/newOrders/popup/Card.vue'
import GiftCardInfo from '../pos/content/cart/newOrders/popup/GiftCardInfo.vue'
import SearchLoyaltyCustomer from '../pos/footer/popups/SearchLoyaltyCustomer'
import Loyalty from '../pos/content/cart/newOrders/popup/Loyalty.vue'
import OnlineOrderDetails from './header/popups/OnlineOrderDetails'
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'
import UserProfile from '@/components/pos/user/UserProfile'
import InformationPopup from '@/components/pos/content/InformationPopup'

import { mapState, mapGetters } from 'vuex'
/* global $, clickPayNow */
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
    Card,
    GiftCardInfo,
    SearchLoyaltyCustomer,
    Loyalty,
    Invoice,
    OrderDetailsPopup,
    UserProfile,
    InformationPopup,
  },
  data() {
    if (window.location.href.indexOf('dine-in') > -1) {
      this.setOrderType({ OTview: 'Dine In', OTApi: 'dine_in' })
    }
    return {
      vbutton: '',
      title: '',
      status: 0,
      message: '',
      checkCover: true,
    }
  },
  computed: {
    ...mapState('checkout', ['print', 'paymentMsgStatus']),
    ...mapState('dinein', ['selectedCover', 'orderReservationData']),
    ...mapState('customer', ['responseInformation']),
    ...mapState('order', ['orderType', 'cartType', 'items', 'is_pay']),
    ...mapState('sync', ['online']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState({
      selectedModal: state => {
        // $('#manage-customer').modal()
        return state.location.setModal == '#loyalty-payment'
          ? '#manage-customer'
          : state.location.setModal
      },
    }),
    ...mapState({
      loyaltyCard: state => state.customer.loyalty.card,
    }),
    ...mapState({ selectedCustomer: state => state.customer.customer.name }),
  },

  watch: {
    paymentMsgStatus(newVal) {
      if (newVal) {
        if (this.$store.state.order.orderType.OTApi === 'dine_in') {
          $('#payment-msg').modal('hide')
          this.$router.replace({ name: 'Dinein' })
        }
        this.$store.commit('checkout/PAYMENT_MSG_STATUS', false)
      }
    },
  },
  methods: {
    payNowDirect() {
      //dine in order
      let validationError = {}
      let checkCovers = this.items.find(element => {
        return (
          element.cover_name == 'undefined' || element.cover_name == undefined
        )
      })
      if (this.items.length > 0) {
        if (
          checkCovers == undefined ||
          checkCovers == 'undefined' ||
          this.selectedCover
        ) {
          $('#payment-msg').modal('show')
          this.$store
            .dispatch('checkout/pay', { action: 'dine-in-place-order' })
            .then(() => {
              //Reset Cart and set states and redirect to dine in.
              this.$store.commit('dinein/SET_COVER', '')
              this.$store.dispatch('order/beforeRedirectResetCartDineIn')
            })
            .catch(response => {
              let validationError = {}
              let errors = ''
              if (response.status === 'form_errors') {
                for (let i in response.form_errors) {
                  response.form_errors[i].forEach(err => (errors += ' ' + err))
                }
              } else if (response.error) {
                errors = response.error
              }
              if (errors !== '') {
                validationError = {
                  status: 'flash_message',
                  flash_message: errors,
                }
                this.$store.commit(
                  'customer/SET_RESPONSE_MESSAGES',
                  validationError
                )
                $('#information-popup').modal('show')
              }
            })
        } else {
          validationError = {
            status: 'flash_message',
            flash_message: this._t('Please select a cover.'),
          }
          this.$store.commit('customer/SET_RESPONSE_MESSAGES', validationError)
          $('#information-popup').modal('show')
        }
      } else {
        validationError = {
          status: 'flash_message',
          flash_message: this._t('Please add items.'),
        }
        this.$store.commit('customer/SET_RESPONSE_MESSAGES', validationError)
        $('#information-popup').modal('show')
      }
    },
    payNowClick() {
      let validationError = {}
      this.items.find(element => {
        if (typeof element.cover_name == 'undefined') {
          this.checkCover = false
        }
      })
      // eslint-disable-next-line no-console
      console.log(this.checkCover)
      // eslint-disable-next-line no-console
      console.log(typeof this.selectedCover, this.orderType.OTApi)
      if (
        this.checkCover ||
        typeof this.selectedCover == 'object' ||
        this.orderType.OTApi !== 'dine_in'
      ) {
        clickPayNow()
      } else {
        validationError = {
          status: 'flash_message',
          flash_message: this._t('Please select a cover for new item.'),
        }
        this.$store.commit('customer/SET_RESPONSE_MESSAGES', validationError)
        $('#information-popup').modal('show')
      }
    },
    viewHoldOrders() {
      this.vbutton = 'new'
      this.$store.commit('order/SET_CART_TYPE', 'hold')
      this.$store.dispatch('holdOrders/getHoldOrders')
    },
    setOrderType(opt) {
      this.$store.commit('order/ORDER_TYPE', opt)
    },
    newOrders() {
      this.vbutton = 'hold'
      this.$store.commit('order/SET_CART_TYPE', 'new')
    },
    add_customer_address() {
      if (this.$store.state.customer.address === false) {
        $('#manage-customer').modal()
      } else {
        $('#order-confirmation').modal()
      }
    },
  },
  mounted() {
    $('ul.ullist-icons').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      accessibility: false,
      dots: false,
      arrows: true,
      nextArrow: '<img class="next-btn" src="img/pos/next-arrow.png"/>',
      prevArrow: '<img class="back-btn" src="img/pos/back-arrow.png"/>',
    })
    $('.next-btn').click()
    setTimeout(function() {
      $('.back-btn').click()
    }, 1000)
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
.displayBlock {
  display: inline-block;
}
.hide {
  display: none;
}
</style>
