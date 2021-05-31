<template>
  <div class="main-orders-total color-text-invert">
    <button
      type="button"
      @click="collapsibleFooter"
      class="btn btn-success cartBottomBtn visible btn-footer-"
    >
      <!--{{ _t('Show amount details') }}-->
      <i aria-hidden="true" :class="buttonArrow"></i>
    </button>
    <div
      :class="['total-wrapper', { active: totalWrapperHendler }]"
      id="content-wrapper-footer"
      style="display: none"
    >
      <div class="item sub-total">
        <div class="sub-total-text">{{ _t('Sub Total') }}</div>
        <div class="sub-total-num">{{ formatPrice(subTotal || 0) }}</div>
      </div>
      <div class="item surcharges">
        <div class="sub-total-text">
          {{ _t('Surcharges') }}
        </div>
        <div class="sub-total-num">{{ formatPrice(surcharge || 0) }}</div>
      </div>
      <div class="item discounts">
        <div class="sub-total-text">
          {{ _t('Discounts') }}
          <span v-if="appliedOrderDiscount">
            ({{ appliedOrderDiscount.name }})</span
          >
        </div>
        <div class="sub-total-num">
          {{ formatPrice(orderDiscountWithoutTax || 0) }}
        </div>
      </div>
      <div class="item tax">
        <div class="sub-total-text">{{ _t('Tax') }}</div>
        <div class="sub-total-num">{{ formatPrice(totalTax || 0) }}</div>
      </div>
      <div class="item surcharges" v-if="deliverySurcharge">
        <div class="sub-total-text">{{ _t('Delivery Surcharge') }}</div>
        <div class="sub-total-num">{{ formatPrice(deliverySurcharge) }}</div>
      </div>
    </div>
    <div class="total color-text">
      <div class="sub-total-text">{{ _t('Total') }}</div>
      <div class="sub-total-num" @click="totalWrapperHendlerChange">
        {{ formatPrice(orderTotal || 0) }}
        <i
          aria-hidden="true"
          :class="['fa', 'fa-angle-up', { active: totalWrapperHendler }]"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'CartFooter',
  props: {},
  data() {
    return {
      buttonArrow: 'fa fa-chevron-down',
    }
  },
  computed: {
    ...mapGetters('order', [
      'orderTotal',
      'subTotal',
      'totalTax',
      'deliverySurcharge',
    ]),
    ...mapGetters('surcharge', ['surcharge']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('discount', ['orderDiscountWithoutTax']),
    ...mapState('discount', ['appliedOrderDiscount']),
    ...mapGetters(['totalWrapperHendler']),
  },
  methods: {
    totalWrapperHendlerChange() {
      this.$store.dispatch('totalWrapperHendlerChange')
    },
    collapsibleFooter() {
      // let coll = document.getElementsByClassName('collapsible_footer')
      // let i
      // eslint-disable-next-line no-debugger
      // for (i = 0; i < coll.length; i++) {
      // coll[i].addEventListener('click', function() {
      // this.classList.toggle('active')
      let content = document.getElementById('content-wrapper-footer')
      if (content.style.display === 'block') {
        content.style.display = 'none'
        this.buttonArrow = 'fa fa-chevron-down'
      } else {
        this.buttonArrow = 'fa fa-chevron-up'
        content.style.display = 'block'
      }
      // })
      // }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
@include responsive(mobile) {
  .main-orders-total {
    .total {
      .sub-total-num {
        .fa {
          display: block !important;
        }
      }
    }
  }
  .remove-surcharge {
    cursor: pointer;
  }
}
.main-orders-total {
  position: relative;
}
.btn-footer- {
  position: absolute;
  bottom: 5px;
  right: 45%;
}
</style>
