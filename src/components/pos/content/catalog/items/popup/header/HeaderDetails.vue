<template>
  <div class="modal-details">
    <div class="POSItemOptions_pricequantity">
      <div class="POSItemOptions_price">
        <label class="POSItemOptions_label">{{ _t('Price') }}</label>
        <div class="POSItemOptions_money">
          {{ formatPrice(item.value) }}
        </div>
      </div>
      <Quantity />
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
  },
  components: {
    Quantity,
  },
}
</script>
