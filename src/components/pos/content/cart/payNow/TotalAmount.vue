<template>
  <div id="total-amount" class="total-amount color-secondary">
    <div class="payment-amount-title">
      <p class="tip-amopunt color-text-invert">{{ _t('Tip Amount') }}</p>
      <p class="total-amt color-text-invert">{{ _t('Total Amount') }}</p>
    </div>
    <div class="payment-amount-digit">
      <p class="color-text-invert">{{ formatPrice(tipAmount) }}</p>
      <h2 class="color-text-invert">{{ formatPrice(orderTotal) }}</h2>
    </div>
    <hr v-if="param.totalAmountBlock" />
    <div class="total-amount-method" v-if="param.totalAmountBlock">
      <svg
        v-if="param.title == 'Cash'"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.01068 13.1473L7.47135 25.3113L29.3167 15.5047L23.856 3.34067L2.01068 13.1473Z"
          fill="#81C784"
        />
        <path
          d="M2.01068 13.1473L7.47135 25.3113L29.3167 15.5047L23.856 3.34067L2.01068 13.1473ZM8.13868 23.55L3.77001 13.8187L23.188 5.102L27.5567 14.8333L8.13868 23.55Z"
          fill="#1B5E20"
        />
        <path
          d="M22.8856 12.5493C23.556 12.2483 23.855 11.4596 23.5534 10.7878C23.2518 10.116 22.4638 9.81547 21.7933 10.1165C21.1229 10.4175 20.8239 11.2061 21.1255 11.8779C21.4271 12.5497 22.2151 12.8503 22.8856 12.5493Z"
          fill="#1B5E20"
        />
        <path
          d="M17.3009 17.9759C19.3116 17.0733 20.2082 14.7079 19.3036 12.6925C18.3989 10.6771 16.0356 9.77494 14.0249 10.6775C12.0142 11.58 11.1176 13.9454 12.0222 15.9608C12.9269 17.9762 15.2902 18.8784 17.3009 17.9759Z"
          fill="#1B5E20"
        />
        <path
          d="M4.89198 15.5075C5.72972 15.1315 6.10327 14.1459 5.72633 13.3061C5.3494 12.4664 4.36472 12.0905 3.52698 12.4665C2.68925 12.8425 2.3157 13.8281 2.69263 14.6679C3.06957 15.5076 4.05425 15.8835 4.89198 15.5075Z"
          fill="#1B5E20"
        />
        <path
          d="M23.7039 7.06396C24.5416 6.68793 24.9152 5.70235 24.5382 4.8626C24.1613 4.02285 23.1766 3.64693 22.3389 4.02296C21.5011 4.39899 21.1276 5.38458 21.5045 6.22433C21.8815 7.06408 22.8661 7.43999 23.7039 7.06396Z"
          fill="#1B5E20"
        />
        <path
          d="M27.7987 16.1861C28.6364 15.8101 29.0099 14.8245 28.633 13.9848C28.2561 13.145 27.2714 12.7691 26.4337 13.1451C25.5959 13.5212 25.2224 14.5067 25.5993 15.3465C25.9762 16.1862 26.9609 16.5622 27.7987 16.1861Z"
          fill="#1B5E20"
        />
        <path
          d="M29.3333 15.3333H5.33331V28.6667H29.3333V15.3333Z"
          fill="#A5D6A7"
        />
        <path
          d="M5.33331 15.3333V28.6667H29.3333V15.3333H5.33331ZM6.66665 27.3333V16.6667H28V27.3333H6.66665Z"
          fill="#388E3C"
        />
        <path
          d="M10 23.3333C10.7364 23.3333 11.3334 22.7364 11.3334 22C11.3334 21.2636 10.7364 20.6667 10 20.6667C9.26364 20.6667 8.66669 21.2636 8.66669 22C8.66669 22.7364 9.26364 23.3333 10 23.3333Z"
          fill="#388E3C"
        />
        <path
          d="M24.6666 23.3333C25.403 23.3333 26 22.7364 26 22C26 21.2636 25.403 20.6667 24.6666 20.6667C23.9303 20.6667 23.3333 21.2636 23.3333 22C23.3333 22.7364 23.9303 23.3333 24.6666 23.3333Z"
          fill="#388E3C"
        />
        <path
          d="M17.3333 26C19.5425 26 21.3333 24.2091 21.3333 22C21.3333 19.7909 19.5425 18 17.3333 18C15.1242 18 13.3333 19.7909 13.3333 22C13.3333 24.2091 15.1242 26 17.3333 26Z"
          fill="#388E3C"
        />
        <path
          d="M28.6667 25.674C28.3873 25.4627 28.0433 25.3333 27.6667 25.3333C26.746 25.3333 26 26.0793 26 27C26 27.3773 26.13 27.7213 26.3413 28.0007H28.6667V25.674Z"
          fill="#388E3C"
        />
        <path
          d="M7 25.3327C6.62333 25.3327 6.27933 25.4627 6 25.6733V28H8.32533C8.53667 27.7207 8.66667 27.3767 8.66667 26.9993C8.66667 26.0787 7.92067 25.3327 7 25.3327Z"
          fill="#388E3C"
        />
        <path
          d="M6 18.326C6.27933 18.5367 6.62333 18.6667 7 18.6667C7.92067 18.6667 8.66667 17.9207 8.66667 17C8.66667 16.6233 8.53667 16.2793 8.326 16H6V18.326Z"
          fill="#388E3C"
        />
        <path
          d="M27.6667 18.6667C28.0433 18.6667 28.3873 18.5367 28.6667 18.326V16H26.3407C26.13 16.2793 26 16.6233 26 17C26 17.9207 26.746 18.6667 27.6667 18.6667Z"
          fill="#388E3C"
        />
      </svg>
      <img
        v-if="param.title == 'Gift Card'"
        src="/src/assets/images/gift.png"
        height="41"
        width="62"
      />
      <img
        v-if="param.title == 'Mastercard'"
        src="/src/assets/images/master-card.png"
        height="41"
        width="62"
      />
      <div class="total-amount-method-title">{{ param.title }}</div>
      <div class="total-amount-method-btn" @click="MethodGhangeHendler">
        Ghange
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'TotalAmount',
  props: ['param'],
  computed: {
    ...mapGetters('order', ['orderTotal']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState('checkoutForm', ['tipAmount']),
  },
  methods: {
    MethodGhangeHendler() {
      if (this.param.title == 'Gift Card') {
        this.$store.dispatch('QRMethodGhangeHendler')
      } else if (this.param.title == 'Cash') {
        this.$store.dispatch('payNowCalcHendlerGhange')
      } else if (this.param.title == 'Mastercard') {
        this.$store.dispatch('methodCardHendlerGhange')
      }
    },
  },
}
</script>
<style lang="scss">
.total-amount {
  hr {
    grid-column-start: 1;
    grid-column-end: 3;
    margin-top: 20px;
    margin-bottom: 20px;
    display: none;
  }

  .total-amount-method {
    grid-column-start: 1;
    grid-column-end: 3;
    display: grid;
    grid-template-columns: max-content 1fr auto;
    align-items: center;
    grid-gap: 10px;

    .total-amount-method-btn {
      border: 2px solid #ef7f2a;
      color: #ef6a05;
      border-radius: 3px;
      padding: 5px 25px;
      font-weight: 600;
      display: none;
    }
  }
}
</style>
