<template>
  <div class="mobile-footer">
    <div
      :class="['btn-cart', { disable: !items.length }]"
      @click="mainOrdersHendlerGhange"
    >
      <svg
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.99999 16C6.46956 16 5.96085 15.7893 5.58578 15.4142C5.21071 15.0391 4.99999 14.5304 4.99999 14C4.99999 13.4696 5.21071 12.9609 5.58578 12.5858C5.96085 12.2107 6.46956 12 6.99999 12C7.53043 12 8.03913 12.2107 8.41421 12.5858C8.78928 12.9609 8.99999 13.4696 8.99999 14C8.99999 14.5304 8.78928 15.0391 8.41421 15.4142C8.03913 15.7893 7.53043 16 6.99999 16ZM14 16C13.4696 16 12.9609 15.7893 12.5858 15.4142C12.2107 15.0391 12 14.5304 12 14C12 13.4696 12.2107 12.9609 12.5858 12.5858C12.9609 12.2107 13.4696 12 14 12C14.5304 12 15.0391 12.2107 15.4142 12.5858C15.7893 12.9609 16 13.4696 16 14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16ZM0.961994 1.923C0.712355 1.91495 0.475635 1.81012 0.301892 1.63068C0.128149 1.45125 0.0310059 1.21127 0.0310059 0.9615C0.0310059 0.711732 0.128149 0.471755 0.301892 0.292318C0.475635 0.11288 0.712355 0.00805181 0.961994 0L2.11299 0C3.01499 0 3.79499 0.626 3.99099 1.506L5.24399 7.148C5.43999 8.028 6.21999 8.654 7.12199 8.654H14.634L16.076 2.884H6.73099C6.4837 2.87272 6.25028 2.76654 6.07928 2.58755C5.90827 2.40857 5.81285 2.17055 5.81285 1.923C5.81285 1.67545 5.90827 1.43743 6.07928 1.25845C6.25028 1.07946 6.4837 0.973284 6.73099 0.962H16.076C16.3683 0.961914 16.6568 1.02848 16.9196 1.15663C17.1823 1.28479 17.4124 1.47116 17.5923 1.70158C17.7722 1.93201 17.8972 2.20041 17.9578 2.4864C18.0184 2.77238 18.013 3.06842 17.942 3.352L16.5 9.12C16.396 9.5362 16.1559 9.90568 15.8178 10.1697C15.4797 10.4337 15.063 10.5771 14.634 10.577H7.12199C6.24679 10.5771 5.39772 10.2787 4.71501 9.7311C4.0323 9.18348 3.55678 8.41938 3.36699 7.565L2.11299 1.923H0.961994Z"
          fill="white"
        />
      </svg>
      <div class="text">
        {{ items.length ? `Cart ${items.length}` : 'Cart is empty' }}
      </div>
    </div>
    <div class="main-orders-buttons">
      <div
        :class="['btn-menu', { active: footerMenuHendler }]"
        @click="footerMenuHendlerGhange"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12Z"
            fill="white"
          />
        </svg>
      </div>
      <div
        :class="['btn-menu-close', { active: !footerMenuHendler }]"
        @click="footerMenuHendlerGhange"
      >
        <i class="fa fa-times" aria-hidden="true"></i>
      </div>
      <div class="btn-chatge" @click="paymentMethodsGhange">
        <div class="btn-chatge-amount">{{ formatPrice(orderTotal || 0) }}</div>
        <div class="btn-chatge-title">CHARGE</div>
      </div>
    </div>
    <div class="btn-next" @click="footerBtnMethod">Next</div>
    <div class="btn-next btn-next-s" @click="footerBtnMethodS">Next</div>
    <div class="btn-Cancel" @click="methodCardHendlerGhange">Cancel</div>
    <div class="qr-voucher-code">
      <div class="title">Voucher code</div>
      <input type="text" placeholder="Enter voucher code" />
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: ['param'],
  computed: {
    ...mapGetters('order', ['items', 'orderTotal', 'subTotal', 'totalTax']),
    ...mapGetters('surcharge', ['surcharge']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters(['footerMenuHendler', 'payMethod']),
    ...mapState('order', ['orderType']),
    ...mapState({
      selectedModal: state =>
        state.location.setModal == '#loyalty-payment'
          ? '#manage-customer'
          : state.location.setModal,
    }),
  },
  methods: {
    mainOrdersHendlerGhange() {
      if (this.items.length) {
        this.$store.dispatch('mainOrdersHendlerGhange')
        this.$store.dispatch('footerButtonHendlerGhange')
      }
    },
    footerMenuHendlerGhange() {
      this.$store.dispatch('footerMenuHendlerGhange')
    },
    payNowCalcHendlerGhange() {
      if (this.payMethod == 'Gift Card') {
        this.$store.dispatch('payNowCalcHendlerGhange')
      }
    },
    paymentMethodsGhange() {
      this.$store.dispatch('paymentMethodsGhange')
    },
    methodCardHendlerGhange() {
      this.$store.dispatch('methodCardHendlerGhange')
    },
    footerBtnMethod() {
      if (this.payMethod == '1') {
        this.$store.dispatch('payNowCalcHendlerGhange')
      } else if (this.payMethod == '2') {
        this.$store.dispatch('loyaltyPaymentHendlerGhange')
      } else if (this.payMethod == '3') {
        this.$store.dispatch('methodCardHendlerGhange')
      } else if (this.payMethod == '4') {
        this.$store.dispatch('QRMethodGhangeHendler')
      }
    },
    footerBtnMethodS() {
      this.$store.dispatch('successfullHendlerGhange')
    },
  },
}
</script>
<style lang="scss">
@import '../../assets/scss/pixels_rem.scss';
@import '../../assets/scss/variables.scss';
@import '../../assets/scss/mixins.scss';

@include responsive(mobile) {
  .mobile-footer {
    padding: 20px 20px 20px 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1;

    .btn-next-s {
      display: none !important;
    }

    .btn-cart {
      width: 100%;
      height: 50px;
      color: #fff;
      display: grid;
      grid-template-columns: max-content 1fr;
      align-items: center;
      background-color: $green-middle;
      letter-spacing: 1px;
      border-radius: $btn-border-radius;
      padding: 0 25px;

      &.disable {
        opacity: 0.5;
      }

      .text {
        margin-left: -13px;
        text-align: center;
      }
    }

    .main-orders-buttons {
      display: grid;
      grid-template-columns: max-content 1fr;
      grid-gap: 20px;
      display: none;
      width: 100%;

      .btn-menu {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $btn-border-radius;
        background-color: $btn-bg-black;
        display: none;

        &.active {
          display: flex;
        }
      }

      .btn-menu-close {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $btn-border-radius;
        background-color: $red;
        color: #fff !important;
        display: none;

        &.active {
          display: flex;
          color: #fff;
        }
      }

      .btn-chatge {
        display: grid;
        align-items: flex-end;
        background-color: $green-middle;
        border-radius: $btn-border-radius;
        height: 50px;
        color: #fff;
        justify-content: center;
        text-align: center;
        padding: 5px;

        .btn-chatge-amount {
          margin-bottom: -5px;

          strong {
            letter-spacing: 1px;
          }
        }
      }
    }

    .btn-next {
      width: 100%;
      height: 50px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $green-middle;
      letter-spacing: 1px;
      border-radius: $btn-border-radius;
      padding: 0 25px;
    }

    .btn-Cancel {
      display: none;
    }

    .qr-voucher-code {
      display: none;
      width: 100%;

      .title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
      }

      input {
        height: 50px;
        width: 100%;
        border-radius: $btn-border-radius;
        border: 2px solid $gray-middle;
        padding: 0 20px;

        &:focus {
          outline: 0;
        }
      }
    }
  }
}
</style>
