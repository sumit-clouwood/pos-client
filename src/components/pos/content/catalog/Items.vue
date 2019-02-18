<template>
  <div class="items vegetable-pizza-wrapper">
    <!--Added Breadcrumb here-->
    <Breadcrumbs />
    <div class="vegetable-pizza-block">
      <div class="vegetable-pizza">
        <div
          class="vegetable"
          v-for="item in items"
          :key="item._id"
          @click.prevent="addToOrder(item)"
        >
          <div>
            <img
              :src="itemImage(item.item_image)"
              :alt="t(item.item_name).name"
            />
            <p class="remove-bottom popover-btn">
              {{ t(item.item_name).name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Breadcrumbs from "./items/Breadcrumbs";
export default {
  name: "Items",
  props: {
    msg: String
  },
  components: {
    Breadcrumbs
  },
  computed: {
    ...mapGetters("category", ["items", "itemImage"])
  },
  methods: mapActions("order", ["addToOrder"])
};
</script>
