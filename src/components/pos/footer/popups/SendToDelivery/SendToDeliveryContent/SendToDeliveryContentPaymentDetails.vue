<template>
  <div id="total-order-wrap" class="total-order">
    <div class="order-notes color-dashboard-background">
      <p class="notes-title color-text-invert">{{ _t('Notes') }}</p>
      <p v-if="orderNotes">
        {{ orderNotes }}
      </p>
    </div>
    <div class="order-confirm-amt" id="total-confirm-order">
      <div class="order-amt-title">
        <p class="text-uppercase color-text-invert">{{ _t('Sub Total') }} :</p>
        <p class="text-uppercase color-text-invert">{{ _t('Surcharges') }} :</p>
        <p class="text-uppercase color-text-invert">
          {{ _t('Order Discount') }} :
        </p>
        <p class="text-uppercase color-text-invert">{{ _t('Tax') }} :</p>
        <p class="text-uppercase color-text-invert" v-if="deliverySurcharge">
          {{ _t('Deliver Surcharge') }} :
        </p>
        <p class="text-uppercase color-text-invert">
          {{ _t('Bill Amount') }} :
        </p>
      </div>
      <div class="order-amt-charges">
        <p class="color-text">{{ formatPrice(subTotal || 0) }}</p>
        <p class="color-text">{{ formatPrice(surcharge || 0) }}</p>
        <p class="color-text">
          {{ formatPrice(orderDiscountWithoutTax || 0) }}
        </p>
        <p class="color-text">{{ formatPrice(totalTax || 0) }}</p>
        <p class="color-text">{{ formatPrice(deliverySurcharge || 0) }}</p>
        <p class="color-text">{{ formatPrice(orderTotal || 0) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SendToDeliveryContentPaymentDetails',
  props: {},
  computed: {
    ...mapState({
      orderNotes: state => state.order.orderNote,
    }),
    ...mapGetters('order', [
      'orderTotal',
      'subTotal',
      'totalTax',
      'deliverySurcharge',
    ]),
    ...mapGetters('surcharge', ['surcharge']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('discount', ['orderDiscountWithoutTax']),
  },
}
</script>
<style lang="scss" scoped>
#total-confirm-order p {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  margin-top: 0 !important;
  height: 30px !important;
}
</style>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
}
</style>
