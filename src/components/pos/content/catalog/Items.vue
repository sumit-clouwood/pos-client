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
          @click.prevent="addToOrder(item)"
        >
          <div>
            <img :src="itemImage(item.item_image)" :alt="item.name" />
            <p class="remove-bottom popover-btn">
              {{ item.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <Popup />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Breadcrumbs from './items/Breadcrumbs'
import Popup from './items/Popup'
export default {
  name: 'Items',
  props: {
    msg: String,
  },
  components: {
    Breadcrumbs,
    Popup,
  },
  computed: {
    ...mapGetters('category', ['items', 'itemImage']),
    ...mapGetters('modifier', ['hasModifiers']),
  },
  methods: {
    addToOrder(item) {
      this.$store.commit('category/SET_ITEM', item)

      if (this.$store.getters['modifier/hasModifiers'](item)) {
        this.$store.dispatch('modifier/setModifierItem', item)
      } else {
        this.$store.dispatch('order/addToOrder', item)
      }
    },
  },
}
</script>
