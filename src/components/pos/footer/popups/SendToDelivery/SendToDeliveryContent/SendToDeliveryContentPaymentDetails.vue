<template>
  <div id="total-order-wrap" class="total-order">
    <div class="order-notes">
      <p class="notes-title">{{ _t("Notes") }}</p>
      <p v-if="orderNotes">
        {{ orderNotes }}
      </p>
    </div>
    <div class="order-confirm-amt" id="total-confirm-order">
      <div class="order-amt-title">
        <p class="text-uppercase">{{ _t("Sub Total") }} :</p>
        <p class="text-uppercase">{{ _t("Surcharges") }} :</p>
        <p class="text-uppercase">{{ _t("Order Discount") }} :</p>
        <p class="text-uppercase">{{ _t("Tax") }} :</p>
        <p class="text-uppercase">{{ _t("Bill Amount") }} :</p>
      </div>
      <div class="order-amt-charges">
        <p>{{ formatPrice(subTotal || 0) }}</p>
        <p>{{ formatPrice(surcharge || 0) }}</p>
        <p>{{ formatPrice(orderDiscountWithoutTax || 0) }}</p>
        <p>{{ formatPrice(totalTax || 0) }}</p>
        <p>{{ formatPrice(orderTotal || 0) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "SendToDeliveryContentPaymentDetails",
  props: {},
  computed: {
    ...mapState({
      orderNotes: state => state.order.orderNote
    }),
    ...mapGetters("order", ["orderTotal", "subTotal"]),
    ...mapGetters("tax", ["totalTax"]),
    ...mapGetters("surcharge", ["surcharge"]),
    ...mapGetters("location", ["formatPrice", "_t"]),
    ...mapGetters("discount", ["orderDiscountWithoutTax"])
  }
};
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
