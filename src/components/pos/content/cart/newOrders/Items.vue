<template>
  <div class="main-orders-list" v-if="items">
    <div
      class="main-orders-list-item color-dashboard-background"
      v-for="(item, index) in items"
      :key="index + '-' + item._id"
    >
      <div class="main-orders-list-item-title color-text">
        <div class="orders-name">{{ dt(item) }}</div>
        <div class="orders-amount">{{ formatPrice(itemPrice(item)) }}</div>
        <div
          class="orders-close"
          @click.prevent="removeFromOrder({ item: item, index: index })"
        >
          <i
            class="fa fa-trash-o color-text-invert"
            aria-hidden="true"
            :alt="_t('delete')"
          ></i>
        </div>
      </div>
      <div class="main-orders-list-item-subtitle color-text-invert">
        @ {{ Num.round(item.undiscountedGrossPrice).toFixed(2) }} x
        {{ item.quantity }}
        {{ discountInfo(item) }}
      </div>
      <div class="main-orders-list-item-buttons">
        <Modifiers v-bind:modifiers="item.modifiers" v-if="item.modifiable" />
        <div
          class="button-plus"
          data-toggle="modal"
          data-target="#POSOrderItemOptions"
          @click="setActiveItem({ orderItem: item, index: index })"
        >
          <i class="fa fa-plus-circle color-text"></i>
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
    ...mapState('order', ['orderType']),
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
  watch: {
    orderType(newVal, previousVal) {
      if (newVal.OTApi !== previousVal.OTApi)
        if (this.$store.state.discount.appliedOrderDiscount) {
          this.$store.dispatch('discount/clearOrderDiscount')
        } else {
          this.$store.dispatch('discount/removeItemDiscount')
        }
    },
  },
}
</script>
