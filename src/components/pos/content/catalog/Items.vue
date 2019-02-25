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
          :data-toggle="hasModifiers(item) ? 'modal' : ''"
          data-target="#POSItemOptions"
          @click.prevent="
            hasModifiers(item) ? setModifierItem(item) : addToOrder(item)
          "
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
    <Popup />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Breadcrumbs from "./items/Breadcrumbs";
import Popup from "./items/Popup";
export default {
  name: "Items",
  props: {
    msg: String
  },
  components: {
    Breadcrumbs,
    Popup
  },
  computed: {
    ...mapGetters("category", ["items", "itemImage"]),
    ...mapGetters("modifier", ["hasModifiers"])
  },
  methods: {
    ...mapActions("order", ["addToOrder"]),
    ...mapActions("modifier", ["setModifierItem"])
  }
};
</script>
