/* global $, showModal */
/* eslint-disable no-console */
// import * as CONST from '@/constants'
import bootstrap from '@/bootstrap'
import { mapGetters } from 'vuex'
// import store from '@/store'

export default {
  computed: {
    ...mapGetters(['bascketItems']),
  },
  methods: {
    itemsAddToCart(item) {
      if (this.splitBill) {
        return false
      }
      this.$store.commit('order/setEditMode', false)
      this.$store.commit('order/RESET_SPLIT_BILL')
      //load data only when new order is starting
      if (!this.$store.state.order.items.length) {
        this.$store.commit('sync/reload', true)
        bootstrap.loadUI('orderStart').then(() => {})
      }

      this.$store.commit('order/SET_CART_TYPE', 'new')
      this.$store.dispatch('order/startOrder')
      $('#POSItemOptions .modifier-option-radio').prop('checked', false)
      $('.food-menu-item').removeClass('active')
      $(this).addClass('active')
      this.$store.commit('category/SET_ITEM', item)
      this.$store.commit('checkoutForm/showCalc', true)
      this.$store.commit('orderForm/updateQuantity', 1)
      if (this.$store.getters['modifier/hasModifiers'](item)) {
        this.$store.dispatch('modifier/assignModifiersToItem', item)
        this.$store.commit('orderForm/clearSelection')
        //handle open item inside popup
        showModal('#POSItemOptions')
      } else {
        if (item.open_item === true) {
          //show popup for open item
          showModal('#open-item')
        } else {
          this.$store.dispatch('order/addToOrder', item)
        }
      }
      this.$store.dispatch('addItemFood', item)

      if (!this.bascketItems.find(x => x.name === item.name)) {
        this.bascketItems.push({ name: item.name, count: 1, class: 'active' })
      } else {
        this.bascketItems.find(x => x.name === item.name).count++
      }
    },
  },
}
