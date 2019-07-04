<template>
  <div class="main-orders color-dashboard-background">
    <Header />
    <div class="main-orders-list-wrapper">
      <HoldingOrders v-if="cartType === 'hold'" />
      <Items v-else />
    </div>
    <PayNow />
    <Footer />
  </div>
</template>

<script>
import Header from "./cart/newOrders/Header.vue";
import HoldingOrders from "./cart/HoldingOrders";
import Footer from "./cart/Footer";
import PayNow from "./cart/PayNow";
import Items from "./cart/newOrders/Items.vue";

import { mapState } from "vuex";

export default {
  name: "Cart",
  props: {
    msg: String
  },
  computed: {
    ...mapState("checkout", ["order"]),
    ...mapState("order", ["cartType"])
  },
  components: {
    Header,
    Items,
    HoldingOrders,
    Footer,
    PayNow
  }
};
</script>
