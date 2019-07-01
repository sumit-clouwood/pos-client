<template>
  <div v-if="item">
    <div class="modal-header">
      <h5 class="modal-title" id="POSItemOptionsTitle">
        {{ item.name }}
      </h5>
      <CloseButton />
    </div>
    <div class="modal-details">
      <div class="POSItemOptions_pricequantity">
        <div class="POSItemOptions_price">
          <label class="POSItemOptions_label">{{ _t('Price') }}</label>
          <div class="POSItemOptions_money">
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
