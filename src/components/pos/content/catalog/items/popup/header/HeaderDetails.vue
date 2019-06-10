<template>
  <div class="modal-details" v-if="item">
    <div class="POSItemOptions_pricequantity">
      <div class="POSItemOptions_price">
        <label class="POSItemOptions_label">{{ _t('Price') }}</label>
        <div class="POSItemOptions_money">
          {{ formatPrice(itemPrice(item)) }}
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
      item: state => state.order.item,
    }),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('order', ['itemPrice']),
  },
  components: {
    Quantity,
  },
}
</script>
