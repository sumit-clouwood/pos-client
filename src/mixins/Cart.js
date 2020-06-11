/* global $, showModal */
/* eslint-disable no-console */
import * as CONST from '@/constants'
import bootstrap from '@/bootstrap'
import { mapState, mapGetters } from 'vuex'
// import store from '@/store'

export default {
  data() {
    return {
      currentItem: {},
    }
  },
  computed: {
    ...mapGetters(['bascketItems']),
    ...mapState('category', ['barcode']),
    ...mapState('location', ['currency']),
    ...mapGetters('location', ['_t']),
    ...mapGetters('category', ['items', 'itemByCode']),
    ...mapGetters(['foodMenuHendler']),
    isEnabled() {
      return this.$store.getters['modules/enabled'](CONST.MODULE_DINE_IN_MENU)
    },
  },
  watch: {},
  methods: {
    setModifiers(item) {
      if (this.$store.getters['modifier/hasModifiers'](item)) {
        this.$store.dispatch('modifier/assignModifiersToItem', item)
        this.$store.commit('orderForm/clearSelection')
        //handle open item inside popup
        showModal('#POSItemOptions')
        $('#POSItemOptions').css({ 'z-index': 9999 })
      } else {
        if (item.open_item === true) {
          //show popup for open item
          showModal('#open-item')
        } else {
          this.$store.dispatch('order/addToOrder', item)
        }
        // $('#POSItemOptions').css({ 'z-index': 999 })
      }
    },
    itemsAddToCart(item) {
      if (this.splitBill) {
        return false
      }
      item.upselling_parent_id = item.upselling_parent_id || false
      if (!item.is_upselling) {
        item.id_with_cart_index =
          item._id + this.$store.getters['order/orderIndex']
        this.$store.commit('category/UP_SELLING_PARENT_ITEM', item, {
          root: true,
        })
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
      if (item.item_type !== CONST.COMBO_ITEM_TYPE) {
        this.setModifiers(item)
      } else {
        // this.$store.dispatch('modifier/assignModifiersToItem', item)
        // this.$store.commit('orderForm/clearSelection')
        this.$store.dispatch('order/addToOrder', item)
        /*item.combo_selected_items.forEach(combo_item => {
          this.setModifiers(combo_item, false)
        })*/
      }
      this.$store.dispatch('addItemFood', item)
      this.$store.commit('category/IS_UP_SELLING_MODIFY', false)

      if (!this.bascketItems.find(x => x.name === item.name)) {
        this.bascketItems.push({ name: item.name, count: 1, class: 'active' })
      } else {
        this.bascketItems.find(x => x.name === item.name).count++
      }
    },
    resetCurrentItem(payLoad) {
      this.currentItem = payLoad
    },
    showDetails(item) {
      this.currentItem = item
      showModal('#item-details-popup')
    },
    IsImageOk(img) {
      if (!img.complete) {
        return false
      }

      if (typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0) {
        return false
      }

      return true
    },

    imageLoadError() {
      for (let i = 0; i < document.images.length; i++) {
        if (!this.IsImageOk(document.images[i])) {
          let hue = 'bg'
          $(document.images[i])
            .closest('div.pos-item-bg')
            .addClass(hue)
          $(document.images[i])
            .siblings('p')
            .css('font-size', '15px')
          $(document.images[i])
            .closest('div.pos-size-bg')
            .addClass(hue)
          // .css('background-color', hue)
          $(document.images[i])
            .siblings('span')
            .css('font-weight', 'bold')
          document.images[i].remove()
        }
      }
    },
  },
}
