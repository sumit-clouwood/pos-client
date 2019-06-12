<template>
  <div class="main-orders-list" v-if="items">
    <div
      class="main-orders-list-item"
      v-for="(item, index) in items"
      :key="index + '-' + item._id"
    >
      <div class="main-orders-list-item-title">
        <div class="orders-name">{{ dt(item) }}</div>
        <div class="orders-amount">{{ formatPrice(itemPrice(item)) }}</div>
        <div
          class="orders-close"
          @click.prevent="removeFromOrder({ item: item, index: index })"
        >
          <i class="fa fa-trash-o" aria-hidden="true" :alt="_t('delete')"></i>
        </div>
      </div>
      <div class="main-orders-list-item-subtitle">
        @ {{ Num.round(item.undiscountedNetPrice) }} x {{ item.quantity }}
        {{ discountInfo(item) }}
      </div>
      <div class="main-orders-list-item-buttons">
        <Modifiers v-bind:modifiers="item.modifiers" v-if="item.modifiable" />
        <div
          class="button-plus"
          data-toggle="modal"
          data-target="#POSItemOptions"
          @click="setActiveItem({ orderItem: item, index: index })"
        >
          <img src="/pos/img/pos/plus-icon.png" alt="plus" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modifiers from './items/Modifiers.vue'
import * as CONST from '@/constants'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'Items',
  props: {},
  computed: {
    ...mapState({
      currentItem: state => state.order.item._id,
    }),
    ...mapGetters('category', ['subcategoryImage']),
    ...mapGetters('modifier', ['hasModifiers']),
    ...mapGetters('order', ['items', 'itemPrice', 'orderModifiers']),
    ...mapGetters('location', ['formatPrice']),
  },
  methods: {
    ...mapActions('category', ['getItems']),
    ...mapActions('order', ['removeFromOrder', 'setActiveItem']),
    discountInfo(item) {
      if (item.discount) {
        return (
          ' - ' +
          (item.discount.type === CONST.VALUE
            ? item.discount.value
            : item.discount.rate + ' %') +
          ' ( ' +
          item.discount.name +
          ' - ' +
          (item.discount.type == CONST.VALUE
            ? this.formatPrice(item.discount.value)
            : item.discount.rate + ' %') +
          ' )'
        )
      }
      return ''
    },
  },
  components: {
    Modifiers,
  },
}
</script>
