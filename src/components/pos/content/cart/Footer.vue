<template>
  <div class="total-amount-wrapper">
    <div class="surcharge-amt">
      <div>
        <span class="total-charges">Sub Total</span>
        <span class="aed-charges">AED {{ subTotal || 0 }}</span>
      </div>
      <div>
        <span class="total-charges">Surcharges</span>
        <span class="aed-charges">AED {{ orderSurcharge || 0 }}</span>
      </div>
      <div>
        <span class="total-charges">Discounts</span>
        <span class="aed-charges">AED {{ orderDiscount || 0 }}</span>
      </div>
      <div>
        <span class="total-charges">Tax</span>
        <span class="aed-charges">AED {{ orderTax || 0 }}</span>
      </div>
    </div>
    <div class="total-amount">
      <div>
        <span class="total-charges">Total</span
        ><span class="aed-charges">AED {{ orderTotal || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CartFooter",
  props: {},
  computed: {
    ...mapGetters("order", [
      "orderTotal",
      "subTotal",
      "orderSurcharge",
      "orderDiscount",
      "orderTax"
    ])
  }
};
</script>
