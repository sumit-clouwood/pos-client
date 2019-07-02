<template>
  <div class="wrappers-orders">
    <div
      class="orders-name cursor-pointer"
      @click="setHoldOrderCart(orderData)"
    >
      <p>
        {{ orderData.order_no }}
      </p>
    </div>
    <div class="aed-amt">
      <span>{{ formatPrice(orderData.balance_due || 0) }}</span>
    </div>
    <div class="dlt-btn" @click="dropHoldOrder(orderData)">
      <img src="img/pos/delete-icon.svg" alt="delete" />
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
