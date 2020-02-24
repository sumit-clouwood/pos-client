<template>
  <div class="main-orders-contacts color-text">
    <div class="main-oreders-title">
      {{
        cartType == 'hold'
          ? _t('Hold Orders')
          : orderData
          ? orderType.OTview + ' #' + orderData.order_no
          : _t('New Order')
      }}
      <div class="main-oreders-date">{{ DateToday }}</div>
    </div>
    <div
      v-if="
        (selectedCustomer && orderType.OTApi === 'dine_in') ||
          (orderType.OTApi !== 'dine_in' &&
            selectedAddress &&
            selectedCustomer &&
            selectedCustomer.customer_addresses.length > 0)
      "
      class="main-oreders-email"
    >
      <template>
        <span
          class="cursor-pointer color-text"
          @click="removeSelectedCustomer()"
        >
          <i class="fa fa-times" aria-hidden="true"></i>
        </span>
        <p v-if="selectedCustomer.email != ''">
          {{ _t('Email') }} : {{ selectedCustomer.email }}
        </p>
        <p v-if="selectedCustomer.name != '' && selectedCustomer.email == ''">
          {{ _t('Name') }} : {{ selectedCustomer.name }}
        </p>
        <div v-if="selectedCustomer.phone_number">
          {{ _t('Phone') }} : {{ selectedCustomer.phone_number }}
        </div>
      </template>
    </div>
    <div
      class="main-oreders-buttons"
      :class="{ smallbuttons: enabledSplitBill }"
    >
      <div
        v-if="brand.move_table && availableTables && cartType !== 'hold'"
        class="driver-container"
      >
        <button
          class="btn btn-success"
          data-target="#dine-in-table-selection"
          data-toggle="modal"
          id="get-available-tables-list"
        >
          {{ _t('Move Table') }}
        </button>
        <DineInTableSelection />
      </div>
      <div
        v-if="brand.number_of_covers && covers && cartType !== 'hold'"
        class="driver-container"
      >
        <button
          class="btn btn-success"
          data-target="#dine-in-cover-selection"
          data-toggle="modal"
          id="get-available-cover-list"
        >
          {{ selectedCover.name ? _t(selectedCover.name) : _t('Select Cover') }}
        </button>
        <DineInCoverSelection />
      </div>
      <div
        v-if="enabledSplitBill && orderId && covers && cartType !== 'hold'"
        class="driver-container"
      >
        <button
          class="btn btn-success"
          @click="showSplitBill"
          id="split-bill-button"
        >
          {{ _t('Split') }} {{ _t('Bill') }}
        </button>
      </div>
      <div v-if="isSplit" class="driver-container">
        <button
          class="btn btn-success"
          @click="printSplit"
          id="split-bill-print-button"
        >
          {{ _t('Print') }}
        </button>
      </div>
      <div class="color-main color-text dine-in-table-guest-details-pos">
        <span class="tables-draw" v-if="selectedTable">
          <img src="img/dinein/dine-intable.svg" />
          <b> {{ selectedTable.number }}</b>
        </span>
        <span class="tables-draw">
          <img src="img/dinein/guest-user.svg" /> <b> {{ guests }}</b>
        </span>
      </div>
      <div class="btn btn-success cartBottomBtn" @click="cartBottom">
        <i aria-hidden="true" class="fa fa-chevron-down"></i>
      </div>
    </div>
    <div class="scrolls">
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
</template>

<script>
/* global $ */
import { bus } from '@/eventBus'

import { mapState, mapGetters, mapActions } from 'vuex'
//import SplitBill from './popup/SplitBill'
//import PreviewSplit from './popup/PreviewSplit.vue'
import DineInTableSelection from './popup/DineInTableSelection'
import DineInCoverSelection from './popup/DineInCoverSelection'
export default {
  name: 'Header',
  components: {
    DineInTableSelection,
    DineInCoverSelection,
    //SplitBill,
    //PreviewSplit,
  },
  data() {
    return {
      showScrollUp: false,
      showScrollDown: false,
      OrderSelectedCover: 'Select Cover',
      myStyle: {
        backgroundColor: '#fff',
      },
      cartItemHeight: 0,
      cartHeight: 0,
      cartInitHeight: 0,
    }
  },
  mounted() {
    bus.$on('showScrollCartUp', option => {
      this.showScrollUp = option
    })
    bus.$on('showScrollCartDown', option => {
      this.showScrollDown = option
    })

    if (!this.selectedTable && !this.orderSource === 'backend') {
      this.$router.push(this.store)
      this.$store.commit('order/ORDER_TYPE', {
        OTview: 'Walk In',
        OTApi: 'walk_in',
      })
    }
  },
  updated() {
    this.$nextTick(() => {
      this.dineCartHeader()
    })
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('dinein', ['getAllCovers']),
    ...mapState('location', ['brand']),
    ...mapState('order', [
      'items',
      'orderId',
      'cartType',
      'orderType',
      'orderData',
      'orderSource',
    ]),
    ...mapState('checkoutForm', ['msg']),
    ...mapState('customer', ['deliveryAreas']),
    ...mapState('dinein', [
      'selectedCover',
      'covers',
      'availableTables',
      'guests',
      'selectedTable',
    ]),
    ...mapState({
      selectedCustomer: state => state.customer.customer,
    }),
    ...mapState({
      selectedAddress: state => state.customer.address,
      isSplit: state =>
        state.order.splitBill && state.order.items.some(item => item.split),
    }),
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['waiter']),

    enabledSplitBill() {
      const newItemsAddedToCart = this.$store.state.order.items.some(
        item => typeof item.no === 'undefined'
      )

      return (
        this.brand.split_bill &&
        this.items.length > 1 &&
        !this.waiter &&
        !newItemsAddedToCart
      )
    },
  },
  methods: {
    scroll(option) {
      bus.$emit('scroll-cart', option)
    },
    printSplit() {
      this.$store.commit('checkoutForm/SET_PROCESSING', true)
      this.$store.dispatch('order/startOrder')
      $('#payment-msg').modal('show')
      this.$store
        .dispatch('checkout/pay', { action: 'dine-in-order-preview' })
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            $('#payment-msg').modal('hide')
          }, 500)
          this.$store.commit('checkoutForm/SET_PROCESSING', false)
        })
    },
    showSplitBill() {
      this.$store.dispatch('order/setSplitBill')
    },
    removeSelectedCustomer() {
      this.$store.commit('location/SET_MODAL', '#manage-customer')
      this.$store.dispatch('customer/resetCustomer')
    },
    showDropdown: function() {
      $('.available-covers').toggle()
    },
    dineCartHeader() {
      let cartHeight = $('.main-orders-list-wrapper').innerHeight()
      this.cartHeight = cartHeight
      this.cartInitHeight = cartHeight
      this.cartItemHeight = $('.main-orders-list').innerHeight()
    },
    cartBottom() {
      this.cartHeight += parseInt(this.cartInitHeight)
      if (this.cartHeight >= this.cartItemHeight) {
        $('.cartBottomBtn').addClass('toggle')
        this.cartHeight = 0
        $('.main-orders-list-wrapper').animate(
          { scrollTop: this.cartHeight },
          1000
        )
        return false
      }
      $('.cartBottomBtn').removeClass('toggle')
      $('.main-orders-list-wrapper').animate(
        { scrollTop: this.cartHeight },
        1000
      )
    },
    hold() {
      $('#holdorder').hide()
      this.$store
        .dispatch('checkout/pay', { action: 'on-hold' })
        .then(() => {
          if (this.msg) {
            $('#payment-msg').modal('show')
          }
          setTimeout(function() {
            $('#payment-screen-footer').prop('disabled', false)
          }, 1000)
        })
        .catch(() => {
          setTimeout(() => {
            $('#payment-msg').modal('hide')
            $('#payment-screen-footer').prop('disabled', false)
          }, 500)
        })
    },
    ...mapActions('checkout', ['orderOnHold']),
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.hide {
  display: none;
}

.smallbuttons {
  button {
  }
}
@include responsive(mobile) {
  .main-orders-contacts {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: none;
    grid-row-gap: 20px;

    .cursor-pointer {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $red !important;
    }

    .main-oreders-title {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    .main-oreders-email {
      padding: 10px 20px;
      border-radius: 5px;
    }

    .main-oreders-buttons {
      display: grid !important;
      align-items: center;
      margin: 0;
      #holdorder {
        height: 35px;
        width: 30%;
        background-color: $green-middle;
      }
    }
  }
}
</style>
<style lang="sass" scoped>
.cartBottomBtn
  opacity: 0

  &.visible
    opacity: 1
  &.down
    margin-left: 10px
    -ms-transform: rotate(180deg)
    transform: rotate(180deg)
</style>
<style lang="sass" scoped>
.scrolls
  margin-top: 4px
</style>
