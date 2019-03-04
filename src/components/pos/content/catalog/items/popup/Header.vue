<template>
  <div v-if="item">
    <div class="modal-header">
      <h5 class="modal-title" id="POSItemOptionsTitle">
        {{ t(item.item_name).name }}
      </h5>
      <CloseButton />
    </div>
    <div class="modal-details">
      <div class="POSItemOptions_pricequantity">
        <div class="POSItemOptions_price">
          <label class="POSItemOptions_label">Price</label>
          <div class="POSItemOptions_money">
            {{ formatPrice(item.item_price) }}
          </div>
        </div>
        <Quantity />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Quantity from './header/Quantity'
import CloseButton from './header/CloseButton'

export default {
  name: 'Header',
  props: {},
  computed: {
    ...mapState({
      item: state => state.modifier.item,
    }),
    ...mapGetters('location', ['formatPrice']),
  },
  components: {
    Quantity,
    CloseButton,
  },
}
</script>
