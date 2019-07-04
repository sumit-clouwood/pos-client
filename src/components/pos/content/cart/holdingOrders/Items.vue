<template>
  <div class="wrappers-orders color-dashboard-background">
    <div
      class="orders-name cursor-pointer color-text"
      @click="setHoldOrderCart(orderData)"
    >
      <p class="color-text">
        {{ orderData.order_no }}
      </p>
    </div>
    <div class="aed-amt">
      <span class="color-text">{{
        formatPrice(orderData.balance_due || 0)
      }}</span>
    </div>
    <div class="dlt-btn" @click="dropHoldOrder(orderData)">
      <i class="fa fa-trash color-text-invert"></i>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
/* global $ */
import { mapGetters } from "vuex";
export default {
  name: "Items",
  props: {
    orderData: Object
  },
  computed: {
    ...mapGetters("location", ["formatPrice"])
  },
  methods: {
    setHoldOrderCart: function(orderData) {
      this.$store.commit("order/SET_CART_TYPE", "new");
      this.$store.dispatch("holdOrders/fetchOrder", orderData);
    },

    dropHoldOrder: function(order) {
      if (confirm("Are you sure you want to delete this order!")) {
        this.$store.dispatch("order/removeOrder", {
          order: order,
          orderType: "hold"
        });
      }
    }
  }
};
</script>
