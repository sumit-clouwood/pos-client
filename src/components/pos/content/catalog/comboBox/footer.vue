<template>
  <div class="modal-footer">
    <div class="text-danger" v-if="error">
      {{ error }}
    </div>
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-success btn-default "
        @click="addComboItemCart"
      >
        {{ _t('Add to Order') }}
      </button>
      <button
        type="button"
        class="btn btn-danger cancel-announce"
        data-dismiss="modal"
        @click="emptyComboSelection"
      >
        {{ _t('Cancel') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Cart from '@/mixins/Cart'
/* global hideModal */
export default {
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('comboItems', [
      'comboItemsList',
      'activeComboItems',
      'setModifiersItem',
      'forCombo',
    ]),
  },
  mixins: [Cart],
  data() {
    return {
      comboItem: [],
      totalItemQty: 0,
      error: false,
    }
  },
  methods: {
    addComboItemCart() {
      let activeItemModifiers = []
      this.validateNumberOfItems()
      let itemQty = 0
      // eslint-disable-next-line no-console
      console.log(this.comboItemsList.combo_items, 'this.comboItemsList')
      // eslint-disable-next-line no-unused-vars
      for (let [key, value] of Object.entries(this.activeComboItems)) {
        value.map(activeItem => {
          let activeChecker = this.setModifiersItem.find(
            mItem => mItem._id === activeItem._id
          )
          if (activeChecker) {
            itemQty += parseInt(activeChecker.quantity)
            // eslint-disable-next-line no-console
            console.log(activeChecker, 'activeChecker')
            let item = this.updateItemPrice(activeChecker)
            activeItemModifiers.push(item)
          } else {
            itemQty += 1
            // eslint-disable-next-line no-console
            console.log(activeItem, 'activeItem', item)
            let item = this.updateItemPrice(activeItem)
            activeItemModifiers.push(item)
          }
        })
      }
      if (this.totalItemQty > itemQty) {
        this.error = `Please select ${this.totalItemQty - itemQty} more item${
          this.totalItemQty - itemQty > 1 ? 's' : ''
        }`
      } else if (this.totalItemQty < itemQty) {
        this.error = `Please remove any ${itemQty - this.totalItemQty} item${
          itemQty - this.totalItemQty > 1 ? 's' : ''
        }`
      } else {
        this.error = false
      }
      let itemPriceSettlement = this.$store.getters[
        'comboItems/priceSettlement'
      ](activeItemModifiers)
      if (!this.error) {
        let item = {
          ...this.comboItemsList,
          combo_selected_items: itemPriceSettlement,
          for_combo: this.forCombo,
        }
        // eslint-disable-next-line no-console
        console.log(activeItemModifiers, 'filtered data', itemPriceSettlement)
        this.itemsAddToCart(item)
        this.$store.commit('comboItems/ACTIVE_COMBO_ITEMS', {}, { root: true })
        hideModal('#combox-box-popup')
      }
    },
    validateNumberOfItems() {
      this.totalItemQty = 0
      this.comboItemsList.combo_items.forEach(itemGrp => {
        this.totalItemQty += parseInt(itemGrp.qty)
      })
    },
    emptyComboSelection() {
      this.comboItem[this.comboItemsList] = false
      this.$store.commit('comboItems/ACTIVE_COMBO_ITEMS', false)
    },
    updateItemPrice(addedItem) {
      this.$store.dispatch('comboItems/updateOrderIndex')
      /*let totalItemInCart =
        parseInt(this.$store.getters['order/orderIndex']) || 1*/
      this.$store.commit(
        'comboItems/SET_FOR_COMBO',
        this.$store.getters['order/orderIndex'],
        {
          root: true,
        }
      )
      return this.$store.getters['comboItems/updateItemPriceTax'](addedItem)
    },
  },
}
</script>
<style scoped>
.btn-announce {
  margin-bottom: 0px !important;
}
@media only screen and (max-width: 600px) and (min-width: 320px) {
  .btn-announce {
    margin: 0 auto;
    margin-bottom: 0px !important;
  }
}
</style>
