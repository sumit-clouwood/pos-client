<template>
  <div class="modal-details color-dashboard-background" v-if="item">
    <div class="POSItemOptions_pricequantity">
      <div class="POSItemOptions_price">
        <label class="POSItemOptions_label color-text-invert">{{
          _t("Price")
        }}</label>
        <div class="POSItemOptions_money color-text">
          {{ formatPrice(item.value * quantity) }}
        </div>
      </div>
      <Quantity />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Quantity from "./Quantity";

export default {
  name: "HeaderDetails",
  props: {},
  computed: {
    ...mapState({
      item: state => state.modifier.item
    }),
    ...mapGetters("location", ["formatPrice", "_t"]),
    ...mapGetters("orderForm", ["quantity"])
  },
  components: {
    Quantity
  }
};
</script>
