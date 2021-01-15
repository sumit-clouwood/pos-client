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
    ...mapGetters('combo', ['current_combo', 'current_order_combo']),
    ...mapGetters(['foodMenuHendler']),
    isEnabled() {
      return this.$store.getters['modules/enabled'](CONST.MODULE_DINE_IN_MENU)
    },
  },
  watch: {},
  methods: {
    validateSection(skipItem) {
      const section = this.$store.getters['combo/current_combo_section']
      const selectedItems = this.$store.getters[
        'combo/current_combo_selected_items'
      ]
      console.log('selected items', selectedItems)
      let selectedItemsInCurrentSection = []
      if (section.qty) {
        this.currentSection = section
        //check if selectedItems contains == section.for_items
        section.for_items.forEach(itemId => {
          if (selectedItems[itemId] && itemId !== skipItem) {
            selectedItemsInCurrentSection.push({
              itemId: itemId,
              qty: selectedItems[itemId],
            })
          }
        })

        let qtySelectedInCurrentSection = 0
        selectedItemsInCurrentSection.forEach(
          itm => (qtySelectedInCurrentSection += itm.qty)
        )
        console.log(
          'quantity selected in current section',
          qtySelectedInCurrentSection
        )
        if (qtySelectedInCurrentSection < section.qty) {
          return section.qty - qtySelectedInCurrentSection
        } else if (qtySelectedInCurrentSection == section.qty) {
          return true
        } else {
          return false
        }
      }
      return true
    },
    setupItemModifiers(item) {
      if (this.$store.getters['modifier/hasModifiers'](item)) {
        console.log('has modifiers')
        this.$store.dispatch('modifier/assignModifiersToItem', item)
        //handle open item inside popup
        console.log('showing modal')
        showModal('#POSItemOptions')
        $('#POSItemOptions').css({ 'z-index': 9999 })
      } else {
        //reset modifiers item
        this.$store.commit('modifier/SET_ITEM', false)
        console.log('no not have modifiers')
        if (item.open_item === true) {
          //show popup for open item
          showModal('#open-item')
        } else {
          if (!this.current_combo) {
            this.$store.dispatch('order/addToOrder', item)
          }
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
      if (item.item_type == CONST.COMBO_ITEM_TYPE) {
        // this.$store.dispatch('modifier/assignModifiersToItem', item)
        // this.$store.commit('orderForm/clearSelection')
        const item = this.$store.getters['combo/order_item']
        if (this.current_order_combo) {
          this.$store
            .dispatch('order/updateComboItemInCart', {
              oldItem: this.current_order_combo,
              newItem: item,
            })
            .then(() => this.$store.commit('combo/RESET', true))
        } else {
          this.$store
            .dispatch('order/addToOrder', item)
            .then(() => this.$store.commit('combo/RESET', true))
        }

        /*item.combo_selected_items.forEach(combo_item => {
          this.setupItemModifiers(combo_item, false)
        })*/
      } else {
        this.setupItemModifiers(item)
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
      this.$nextTick(() => {
        showModal('#item-details-popup')
      })
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
