<template>
  <div class="order-item wrappers-order-block">
    <div class="wrappers-orders" v-for="item in items" :key="item._id">
      <div class="orders-name">
        <p>{{ t(item.item_name).name }}</p>
        <p class="price-qty">@ {{ item.item_price }} x {{ item.quantity }}</p>
        <Modifiers />
      </div>
      <div class="aed-amt">
        <span>{{ currency(item._id) }} {{ itemPrice(item) }}</span>
      </div>
      <div class="dlt-btn">
        <a href="" @click.prevent="removeFromOrder(item)">
          <img src="img/pos/delete-icon.svg" alt="delete" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Modifiers from "./items/Modifiers.vue";
import Mixins from "./mixins";

import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Items",
  props: {},
  mixins: [Mixins],
  computed: {
    ...mapState({
      items: state => state.order.items,
      currentItem: state => state.order.item._id
    }),
    ...mapGetters("category", ["subcategoryImage"]),
    ...mapGetters("order", ["itemPrice"])
  },
  methods: {
    ...mapActions("category", ["getItems"]),
    ...mapActions("order", ["removeFromOrder"])
  },
  components: {
    Modifiers
  }
};
</script>
