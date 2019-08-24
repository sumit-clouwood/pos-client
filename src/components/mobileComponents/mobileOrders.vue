<template>
  <cart />
</template>

<script>
import cart from "../pos/content/Cart.vue";
import { mapGetters } from "vuex";

export default {
  name: "mobileOrders",
  components: {
    cart
  },
  computed: {}
};
</script>

<style lang="scss">
.main-orders-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
}
</style>
