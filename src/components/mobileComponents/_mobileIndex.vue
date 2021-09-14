<template>
  <div class="mobile-components">
    <mobile-notification />
    <profile-sidebar />
    <mobile-page />
    <mobile-payment-methods />
    <cart />
    <mobile-calc />
    <payment-successfull />
    <!-- <cashier />
    <method-card /> -->
    <QRMethod />
    <loyalty v-if="brand" />
    <selectDiscount />
    <add-note />
    <cart-input />
  </div>
</template>
<script>
import mobileNotification from './mobileNotification.vue'
import profileSidebar from './mobileProfileSidebar.vue'
import mobilePaymentMethods from './choosePayMethods.vue'
import mobilePage from './mobilePage.vue'
import cart from '../pos/content/Cart'
import mobileCalc from './mobileCalc.vue'
import paymentSuccessfull from './paymentSuccessfull.vue'
//import cashier from './cashier.vue'
//import methodCard from './methodCard.vue'
import QRMethod from './QRMethod.vue'
import loyalty from './loyalty.vue'
import selectDiscount from './selectDiscount.vue'
import addNote from './addNote.vue'
import cartInput from './cartInput.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    mobileNotification,
    profileSidebar,
    mobilePage,
    mobilePaymentMethods,
    cart,
    mobileCalc,
    paymentSuccessfull,
    //cashier,
    // methodCard,
    QRMethod,
    loyalty,
    selectDiscount,
    addNote,
    cartInput,
  },
  computed: {
    ...mapGetters('brand', ['brand']),
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.mobile-components {
  display: none;
}
@include responsive(mobile) {
  .mobile-components {
    z-index: 50;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    letter-spacing: 0.5px;

    .mobile-page {
      .mobile-header {
        .current-sale {
          .title {
            font-size: 18px;
            margin: 0;
          }
        }
      }
    }

    .loading-modules {
      width: auto;
    }

    .total-amount {
      hr {
        display: block;
      }

      .total-amount-method {
        .total-amount-method-btn {
          display: block;
        }
      }
    }
  }
}
</style>
