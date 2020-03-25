<template>
  <div
    class="POSItemOptions_quantity color-dashboard-background quantity-component"
  >
    <label class="POSItemOptions_label color-text-invert lbl-quantity">
      {{ _t('Quantity') }}
    </label>
    <div class="POSItemOptions_quantity_wrapper inputs-wrapper">
      <template v-if="show">
        <div class="POSItemOptions_quantity_inputs">
          <button
            class="qtyminus value-qty color-text-invert"
            @click="updateFormQuantity('-')"
          >
            -
          </button>
          <input
            v-model.number="quantity"
            @keypress="filterInput"
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
        <div class="POSItemOptions_quantity_submit btn-set-quantity">
          <button @click="updateItemQty()" class="color-main color-text-invert">
            <img src="img/pos/right.png" alt="check" /> Set Quantity
          </button>
        </div>
      </template>
      <template v-else>{{ quantity }}</template>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Header',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['item', 'orderSource']),
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
    show() {
      let allowed = true
      if (
        typeof this.item.no !== 'undefined' &&
        this.orderSource !== 'backend'
        //not backend and still editing order? that means its carhop or waiter order
      ) {
        allowed = false
      }
      return allowed
    },
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
    filterInput($event) {
      const keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (keyCode < 48 || keyCode > 57) {
        $event.preventDefault()
      }
    },
  },
}
</script>
<style lang="scss">
.POSItemOptions_quantity_submit {
  button {
    img {
      margin-right: 5px;
    }
  }
}
</style>
<style lang="scss" scoped>
.POSItemOptions
  .modal-dialog
  .modal-content
  .modal-details
  .POSItemOptions_pricequantity {
  .POSItemOptions_quantity {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .POSItemOptions_quantity_submit {
      margin-left: 1em;
    }
  }
}
</style>
