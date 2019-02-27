<template>
  <div class="order-item wrappers-order-block" v-if="items">
    <div
      class="wrappers-orders"
      v-for="(item, index) in items"
      :key="index + '-' + item._id"
    >
      <div class="orders-name">
        <p>{{ t(item.item_name).name }}</p>
        <p class="price-qty">@ {{ item.item_price }} x {{ item.quantity }}</p>
        <Modifiers v-bind:modifiers="item.modifiers" v-if="item.modifiable" />
        <span data-toggle="modal" data-target="#POSOrderItemOptions">
          <img
            src="img/pos/plus-icon.png"
            alt="plus"
            @click="setActiveItem({ orderItem: item, index: index })"
          />
        </span>
      </div>
      <div class="aed-amt">
        <span>{{ formatPrice(itemPrice(item)) }}</span>
      </div>
      <div class="dlt-btn">
        <a
          href=""
          @click.prevent="removeFromOrder({ item: item, index: index })"
        >
          <img src="img/pos/delete-icon.svg" alt="delete" />
        </a>
      </div>
    </div>
    <Popup />
  </div>
</template>

<script>
import Modifiers from './items/Modifiers.vue'
import Popup from './items/Popup'

import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'Items',
  props: {},
  computed: {
    ...mapState({
      items: state => state.order.items,
      currentItem: state => state.order.item._id,
    }),
    ...mapGetters('category', ['subcategoryImage']),
    ...mapGetters('modifier', ['hasModifiers']),
    ...mapGetters('order', ['itemPrice', 'orderModifiers']),
    ...mapGetters('location', ['formatPrice']),
  },
  methods: {
    ...mapActions('category', ['getItems']),
    ...mapActions('order', ['removeFromOrder', 'setActiveItem']),
  },
  components: {
    Modifiers,
    Popup,
  },
}
</script>
