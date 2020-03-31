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
    ]),
  },
  mixins: [Cart],
  data() {
    return {
      comboItem: [],
      for_combo: 0,
      totalItemQty: 0,
      error: false,
    }
  },
  methods: {
    addComboItemCart() {
      let activeItemModifiers = []
      // eslint-disable-next-line no-console
      console.log(this.comboItemsList, 'this.activeComboItems')
      this.validateNumberOfItems()

      // eslint-disable-next-line no-unused-vars
      for (let [key, value] of Object.entries(this.activeComboItems)) {
        value.map(activeItem => {
          let activeChecker = this.setModifiersItem.find(
            mItem => mItem._id === activeItem._id
          )
          if (activeChecker) {
            activeChecker.for_combo = this.for_combo
            // eslint-disable-next-line no-console
            console.log(activeChecker, 'activeChecker')
            activeItemModifiers.push(activeChecker)
          } else {
            activeItem.for_combo = this.for_combo
            // eslint-disable-next-line no-console
            console.log(activeItem, 'activeItem')
            activeItemModifiers.push(activeItem)
          }
        })
      }
      if (this.totalItemQty > parseInt(activeItemModifiers.length)) {
        this.error =
          'Please select ' +
          (this.totalItemQty - parseInt(activeItemModifiers.length)) +
          ' more item'
      } else if (this.totalItemQty < parseInt(activeItemModifiers.length)) {
        this.error =
          'Please remove any ' +
          (parseInt(activeItemModifiers.length) - this.totalItemQty) +
          ' items'
      } else {
        this.error = false
      }
      if (!this.error) {
        let item = {
          ...this.comboItemsList,
          combo_selected_items: activeItemModifiers,
          for_combo: this.for_combo,
        }
        // eslint-disable-next-line no-console
        console.log(activeItemModifiers, 'filtered data')
        this.itemsAddToCart(item)
        this.$store.commit('comboItems/ACTIVE_COMBO_ITEMS', {}, { root: true })
        this.for_combo++
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
  },
}
</script>
<style scoped>
@media only screen and (max-width: 600px) and (min-width: 320px) {
  .btn-announce {
    margin: 0 auto;
  }
}
</style>
