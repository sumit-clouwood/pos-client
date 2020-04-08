<template>
  <div :class="['method-card', { active: methodCardHendler }]">
    <mobile-pay-header
      :param="{ title: 'Order Payment', subtitle: 'Order ID #0213232' }"
    />
    <div class="method-card-body">
      <total-amount :param="{ totalAmountBlock: true, title: 'Mastercard' }" />
      <div class="insert-cart">
        <svg
          width="63"
          height="73"
          viewBox="0 0 63 73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M58.0711 0.100006H4.92889C2.29135 0.100006 0.105164 2.19373 0.105164 4.83128V18.7552C0.105164 21.3927 2.28771 23.5789 4.92889 23.5789H8.38762L8.7502 17.3014C7.47766 17.3014 6.4752 16.2989 6.4752 15.0264V8.56392C6.4752 7.29137 7.47766 6.38137 8.7502 6.38137L54.2502 6.37782C55.5227 6.37782 56.5252 7.28782 56.5252 8.56036V15.0228C56.5252 16.2954 55.5227 17.2978 54.2502 17.2978L54.6128 23.5754H58.0715C60.7091 23.5754 62.8952 21.3928 62.8952 18.7516V4.83136C62.8952 2.19382 60.7127 0.100092 58.0715 0.100092L58.0711 0.100006Z"
            fill="#B0B2BB"
          />
          <path
            d="M47.151 11.02H15.8488C13.2113 11.02 11.1176 12.84 11.1176 15.115L8.02502 68.7122C8.02502 70.9872 10.1188 72.8996 12.7563 72.8996H50.3402C52.9777 72.8996 55.0715 70.9872 55.0715 68.7122L51.9789 15.115C51.883 12.84 49.7928 11.02 47.1517 11.02H47.151ZM20.5799 28.9461H17.4874C16.2148 28.9461 15.2124 27.9436 15.2124 26.8524V17.2082C15.2124 16.0244 16.2148 15.2069 17.4874 15.2069H20.5799C21.8525 15.2069 22.9474 16.1169 22.9474 17.2082V26.856C22.855 27.9473 21.8526 28.9462 20.5799 28.9462V28.9461ZM33.7749 65.2569C33.7749 66.4406 32.7725 67.4394 31.4999 67.4394H25.2224C23.9498 67.4394 22.8549 66.437 22.8549 65.2569V59.7969C22.8549 58.6132 23.9462 57.7032 25.2224 57.7032H31.4999C32.7725 57.7032 33.7749 58.6132 33.7749 59.7969V65.2569ZM38.1437 66.6219C38.1437 66.9845 37.8699 67.3506 37.4149 67.3506C36.9599 67.3506 36.6862 67.0769 36.6862 66.6219V56.9741C36.6862 56.6115 36.9599 56.2454 37.4149 56.2454C37.8699 56.2454 38.1437 56.5191 38.1437 56.9741V66.6219ZM38.1437 52.8791C38.1437 53.2417 37.8699 53.6078 37.4149 53.6078C36.9599 53.6078 36.6862 53.3341 36.6862 52.8791V43.2313C36.6862 42.8687 36.9599 42.5026 37.4149 42.5026C37.8699 42.5026 38.1437 42.7763 38.1437 43.2313V52.8791ZM38.1437 39.1363C38.1437 39.4988 37.8699 39.865 37.4149 39.865C36.9599 39.865 36.6862 39.5913 36.6862 39.1363V29.4921C36.6862 29.1295 36.9599 28.7634 37.4149 28.7634C37.8699 28.7634 38.1437 29.0371 38.1437 29.4921V39.1363ZM38.1437 25.3971C38.1437 25.7597 37.8699 26.1258 37.4149 26.1258C36.9599 26.1258 36.6862 25.8521 36.6862 25.3971V15.7493C36.6862 15.3867 36.9599 15.0205 37.4149 15.0205C37.8699 15.0205 38.1437 15.2943 38.1437 15.7493V25.3971ZM46.2412 66.621C46.2412 66.9836 45.8786 67.3497 45.4236 67.3497C44.9686 67.3497 44.606 67.076 44.606 66.621L44.6025 40.5013C44.6025 40.1387 44.9651 39.7726 45.4201 39.7726C45.8751 39.7726 46.2376 40.0463 46.2376 40.5013L46.2412 66.621ZM49.3373 22.6671C49.3373 24.5795 47.6097 26.1258 45.4236 26.1258C43.241 26.1258 41.5098 24.5795 41.5098 22.6671C41.5098 21.9384 41.7835 21.2096 42.3274 20.5734C41.8724 20.0259 41.5098 19.3008 41.5098 18.4796C41.5098 16.5672 43.2374 15.0209 45.4236 15.0209C47.6061 15.0209 49.3373 16.5672 49.3373 18.4796C49.3373 19.2083 49.0636 19.9371 48.5197 20.5734C49.0636 21.2096 49.3373 21.8459 49.3373 22.6671Z"
            fill="#B0B2BB"
          />
        </svg>
        <div class="title">Please insert a card</div>
        <div class="subtitle">or NFC</div>
      </div>
    </div>
    <mobile-footer :param="{ method: 'cardInput' }" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import totalAmount from '../pos/content/cart/payNow/TotalAmount.vue'
import mobilePayHeader from './mobilePayHeader.vue'
import mobileFooter from './mobileFooter.vue'

export default {
  name: 'payMethod',
  components: {
    totalAmount,
    mobilePayHeader,
    mobileFooter,
  },
  computed: {
    ...mapGetters(['methodCardHendler']),
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.method-card {
  position: fixed;
  top: 0;
  right: -100vw;
  width: 100vw;
  bottom: 0;
  background-color: #fff;
  z-index: 1055;
  transition: 0.5s ease-out;
  width: 100vw;
  height: 100%;
  display: none;
  grid-template-rows: max-content 1fr max-content;

  .btn-next {
    display: none;
  }

  .btn-next-s {
    display: flex !important;
  }

  @include responsive(mobile) {
    display: grid;
  }

  &.active {
    right: 0;
  }

  .pay-header {
    padding-bottom: 10px;
    grid-template-columns: 1fr;

    .pay-header-buttons {
      display: none;
    }
  }

  .method-card-header {
    padding: 20px;
  }

  .method-card-body {
    padding: 0 20px;
    display: grid;
    grid-template-rows: max-content 1fr;

    svg {
    }

    .insert-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2px solid $gray-middle;
      margin-top: auto;
      border-radius: $card-border-radius;
      padding: 50px 20px;
    }

    .title {
      margin-top: 20px;
    }

    .subtitle {
      font-size: 12px;
      color: $gray-dark;
    }
  }

  .mobile-footer {
    .btn-cart {
      display: none;
    }

    .btn-next {
    }

    .btn-Cancel {
      display: none;
      align-items: center;
      justify-content: center;
      color: #fff;
      background-color: $red;
      width: 100%;
      height: 50px;
      border-radius: $btn-border-radius;
    }
  }
}
</style>
