<template>
  <div class="modal-details color-dashboard-background">
    <div class="POSItemOptions_pricequantity">
      <div class="POSItemOptions_price" v-if="item && !current_combo">
        <label class="POSItemOptions_label color-text-invert">{{
          _t('Price')
        }}</label>
        <div class="POSItemOptions_money color-text">
          {{ formatPrice(item.value * quantity) }}
        </div>
      </div>
      <Quantity v-if="item || current_combo_selected_item" :item="item" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Quantity from './Quantity'

export default {
  name: 'HeaderDetails',
  props: {},
  computed: {
    ...mapState({
      item: state => state.modifier.item,
    }),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('orderForm', ['quantity']),
    ...mapGetters('combo', ['current_combo', 'current_combo_selected_item']),
  },
  components: {
    Quantity,
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
@include responsive(mobile) {
  .POSItemOptions_pricequantity {
    .POSItemOptions_label {
      padding-left: 8px !important;
    }
    .quantity-wrapper {
      position: relative !important;
      left: 0 !important;
      right: 0 !important;
    }

    .item-count-wrapper {
      margin-left: 1rem;
      margin-right: 1rem;
    }
    .postItem-wrapper {
      flex-flow: nowrap !important;
    }
    .quantity-btn-wrapper {
      width: 100%;
    }
    .POSItemOptions_price {
      display: grid !important;
      grid-template-columns: 2fr 2fr !important;
      padding: 4px !important;
    }
  }
}
</style>
