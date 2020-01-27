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
      <div class="btn btn-success cartBottomBtn" @click="cartBottom">
        <i aria-hidden="true" class="fa fa-chevron-down"></i>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters, mapActions } from 'vuex'
import DateTimeVue from '@/components/util/DateTimeVue'
export default {
  name: 'Header',
  props: {},
  components: {
    DateTimeVue,
  },
  data() {
    return {
      cartItemHeight: 0,
      cartHeight: 0,
      cartInitHeight: 0,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['items', 'cartType', 'orderType']),
    ...mapState('checkoutForm', ['msg']),
    ...mapState({ selectedCustomer: state => state.customer.customer }),
    ...mapState({ offlineCustomer: state => state.customer.offlineData }),
    ...mapState('sync', ['online']),
  },
  updated() {
    this.$nextTick(() => {
      this.cartHeader()
    })
  },
  methods: {
    removeSelectedCustomer() {
      this.$store.commit('location/SET_MODAL', '#manage-customer')
      this.$store.dispatch('customer/resetCustomer')
    },
    cartHeader() {
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
      this.$store
        .dispatch('checkout/pay', { action: 'on-hold' })
        .then(() => {
          /*if (this.changedAmount >= 0.1) {
                    $('#payment-msg').modal('hide')
                    $('#change-amount').modal('show')
                  } else*/
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
<style lang="sass" scoped>
.hide
  display : none
  .cartBottomBtn
    width: 50px
</style>
