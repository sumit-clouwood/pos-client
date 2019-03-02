<template>
  <div class="POSItemOptions_quantity">
    <label class="POSItemOptions_label">Quantity</label>
    <div class="POSItemOptions_quantity_wrapper">
      <div class="POSItemOptions_quantity_inputs">
        <button class="qtyminus value-qty" @click="updateFormQuantity('-')">
          -
        </button>
        <input v-model.number="quantity" min="1" class="qty" />
        <button class="qtyplus value-qty" @click="updateFormQuantity('+')">
          +
        </button>
      </div>
      <div class="POSItemOptions_quantity_submit">
        <button @click="updateItemQty()">
          <img src="img/pos/right.png" alt="check" /> Set Quantity
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Header',
  computed: {
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
