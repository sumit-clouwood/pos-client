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
    <div class="main-oreders-buttons">
      <div
        v-if="availableTables && cartType !== 'hold'"
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
      <div v-if="covers && cartType !== 'hold'" class="driver-container">
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
      <div v-if="covers && cartType !== 'hold'" class="driver-container">
        <button
          class="btn btn-success"
          @click="showSplitBill"
          id="split-bill-button"
        >
          {{ _t('Split') }} {{ _t('Bill') }}
        </button>
      </div>
      <div class="color-main color-text dine-in-table-guest-details-pos">
        <span class="tables-draw">
          <img src="img/dinein/dine-intable.svg" />
          <b> {{ selectedTable.number }}</b>
        </span>
        <span class="tables-draw">
          <img src="img/dinein/guest-user.svg" /> <b> {{ guests }}</b>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
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
      OrderSelectedCover: 'Select Cover',
      myStyle: {
        backgroundColor: '#fff',
      },
    }
  },
  mounted() {
    if (!this.selectedTable) {
      this.$router.push(this.store)
      this.$store.commit('order/ORDER_TYPE', {
        OTview: 'Walk In',
        OTApi: 'walk_in',
      })
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('dinein', ['getAllCovers']),
    ...mapState('order', ['items', 'cartType', 'orderType', 'orderData']),
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
    ...mapState({ selectedAddress: state => state.customer.address }),
    ...mapGetters('context', ['store']),
  },
  methods: {
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
@import '../../../assets/scss/pixels_rem.scss';
@import '../../../assets/scss/variables.scss';
@import '../../../assets/scss/mixins.scss';

.hide {
  display: none;
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
      display: flex !important;
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
