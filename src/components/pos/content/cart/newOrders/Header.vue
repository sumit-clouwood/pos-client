<template>
  <div class="main-orders-contacts color-text">
    <div class="main-oreders-title">
      {{ cartType == 'hold' ? _t('Hold Orders') : _t('New Orders') }}
      <div class="main-oreders-date">{{ DateToday }}</div>
    </div>
    <div
      v-if="
        selectedAddress &&
          selectedCustomer &&
          selectedCustomer.customer_addresses.length > 0
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
    <div class="main-oreders-buttons" v-if="items.length">
      <!--<div class="orders-button-large" disabled="disable">
              {{ _t('Move Table') }}
            </div>
            <div class="orders-button-large" disabled="disable">
              {{ _t('Split Table') }}
            </div>-->
      <div
        v-if="cartType !== 'hold'"
        id="holdorder"
        class="orders-button-large color-main color-text"
        @click="hold"
      >
        {{ _t('Hold') }}
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Header',
  props: {},

  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['items', 'cartType']),
    ...mapState('checkoutForm', ['msg']),
    ...mapState({ selectedCustomer: state => state.customer.customer }),
    ...mapState({ selectedAddress: state => state.customer.address }),
  },
  methods: {
    removeSelectedCustomer() {
      this.$store.commit('location/SET_MODAL', '#manage-customer')
      this.$store.dispatch('customer/resetCustomer')
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
@import '../../../../../assets/scss/pixels_rem.scss';
@import '../../../../../assets/scss/variables.scss';
@import '../../../../../assets/scss/mixins.scss';

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
