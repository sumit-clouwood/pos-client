<template>
  <div class="POSItemOptions_quantity color-dashboard-background">
    <label class="POSItemOptions_label color-text-invert">{{
      _t('Quantity')
    }}</label>
    <div class="POSItemOptions_quantity_wrapper">
      <div class="POSItemOptions_quantity_inputs">
        <button
          class="qtyminus value-qty color-text-invert"
          @click="updateFormQuantity('-')"
        >
          -
        </button>
        <input
          v-model.number="quantity"
          min="1"
          class="qty color-text-invert"
        />
        <button
          class="qtyplus value-qty color-text-invert"
          @click="updateFormQuantity('+')"
        >
          +
        </button>
      </div>
      <div class="POSItemOptions_quantity_submit">
        <button @click="updateItemQty()" class="color-main color-text-invert">
          <img src="img/pos/right.png" alt="check" /> Set Quantity
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Header',
  computed: {
    ...mapGetters('location', ['_t']),
    quantity: {
      get() {
        return this.$store.getters['orderForm/quantity']
      },
      set(value) {
        this.$store.commit('orderForm/updateQuantity', value)
      },
    },
  },
  methods: {
    updateFormQuantity(action) {
      if (action == '+') {
        this.$store.commit(
          'orderForm/updateQuantity',
          this.$store.getters['orderForm/quantity'] + 1
        )
      } else {
        if (this.$store.getters['orderForm/quantity'] > 1) {
          this.$store.commit(
            'orderForm/updateQuantity',
            this.$store.getters['orderForm/quantity'] - 1
          )
        }
      }
    },
    updateItemQty() {
      this.$store.dispatch(
        'order/updateQuantity',
        this.$store.getters['orderForm/quantity']
      )
    },
  },
}
</script>
