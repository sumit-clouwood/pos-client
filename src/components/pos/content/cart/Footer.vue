<template>
  <div class="main-orders-total color-text-invert">
    <div :class="['total-wrapper', { active: totalWrapperHendler }]">
      <div class="item sub-total">
        <div class="sub-total-text">{{ _t('Sub Total') }}</div>
        <div class="sub-total-num">{{ formatPrice(subTotal || 0) }}</div>
      </div>
      <div class="item surcharges">
        <div class="sub-total-text">
          {{ _t('Surcharges') }}
          <span class="text-danger remove-surcharge" @click="removeSurcharge"
            >( <i class="fa fa-close"></i> )</span
          >
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
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'CartFooter',
  props: {},
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
    ...mapActions('surcharge', ['removeSurcharge']),
  },
}
</script>
<style lang="scss">
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
</style>
