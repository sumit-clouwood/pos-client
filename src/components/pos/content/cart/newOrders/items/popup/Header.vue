<template>
  <div v-if="item" class="modal-header-wrapper">
    <div class="modal-header color-secondary">
      <h5 class="modal-title color-text-invert" id="POSItemOptionsTitle">
        {{ dt(item) }}
      </h5>
      <CloseButton />
    </div>
    <div class="modal-details">
      <div class="POSItemOptions_pricequantity">
        <div class="POSItemOptions_price">
          <label class="POSItemOptions_label price-wrapper">{{
            _t('Price')
          }}</label>
          <div class="POSItemOptions_money amount-wrapper">
            {{ formatPrice(item.value * quantity) }}
          </div>
        </div>
        <Quantity />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Quantity from '@/components/pos/content/catalog/items/popup/header/Quantity'
import CloseButton from '@/components/pos/content/catalog/items/popup/header/CloseButton'

export default {
  name: 'Header',
  props: {},
  computed: {
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('order', ['item']),
    ...mapGetters('orderForm', ['quantity']),
  },
  components: {
    Quantity,
    CloseButton,
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .modal-header-wrapper {
    z-index: 1;
    .price-wrapper {
      padding-left: 8px !important;
    }
    .amount-wrapper {
      width: 34vw;
      padding-right: 0px !important;
    }
    .modal-details {
      padding-left: 0px !important;
    }
  }
}
</style>
