<template>
  <div
    class="POSItemOptions_quantity color-dashboard-background quantity-wrapper pos-quantity-wrapper quantity-component"
  >
    <label class="POSItemOptions_label color-text-invert lbl-quantity">{{
      _t('Quantity')
    }}</label>
    <div
      class="POSItemOptions_quantity_wrapper postItem-wrapper inputs-wrapper"
    >
      <template v-if="show()">
        <div class="POSItemOptions_quantity_inputs item-count-wrapper">
          <button
            class="qtyminus value-qty color-text-invert"
            @click="updateFormQuantity('-')"
          >
            -
          </button>
          <input
            @keydown="Num.toNumberOnly($event)"
            pattern="[0-9]"
            @paste.prevent
            min="1"
            class="qty color-text-invert"
            v-model.number="quantity"
          />
          <button
            class="qtyplus value-qty color-text-invert"
            @click="updateFormQuantity('+')"
          >
            +
          </button>
        </div>
        <div
          class="POSItemOptions_quantity_submit btn-set-quantity"
          v-show="!current_combo"
        >
          <button @click="updateItemQty()" class="color-main color-text-invert">
            <img src="img/pos/right.png" alt="check" /> {{ _t('Set Quantity') }}
          </button>
        </div>
      </template>
      <template v-else>{{ quantity }}</template>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-console */

import { mapGetters, mapState } from 'vuex'
import Cart from '@/mixins/Cart'

export default {
  name: 'Header',
  mixins: [Cart],
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('combo', ['current_combo', 'current_combo_selected_item']),
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
      //if it is combo item
      if (this.current_combo) {
        // check if current quantity + items selected for this section < allowed quantity for this section

        if (action == '+') {
          let qty = this.validateSection(this.current_combo_selected_item._id)
          //add qty of this item
          console.log('remaining qty to choose', qty)
          if (qty !== false && qty !== true) {
            //previously selected quantity is less than requried quantity
            //get quantity of current item from previous selection, and subtract it from qty, because
            //we are recalculating quantity for current item

            let formQty = this.$store.getters['orderForm/quantity'] + 1
            console.log('form quantity', formQty)
            if (qty >= formQty) {
              this.$store.commit('orderForm/updateQuantity', formQty)
            }
          }
        } else {
          if (this.$store.getters['orderForm/quantity'] > 1) {
            this.$store.commit(
              'orderForm/updateQuantity',
              this.$store.getters['orderForm/quantity'] - 1
            )
          }
        }
      } else {
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
@import '@/assets/scss/header';
@import '@/assets/scss/mixins.scss';
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

@include responsive(mobile) {
  .POSItemOptions_quantity_inputs {
    width: 50px !important;
  }
  .quantity-wrapper {
    position: relative !important;
    display: flex !important;
    left: 0 !important;
    right: 0 !important;
    padding-left: 8px !important;
  }

  .item-count-wrapper {
    margin-left: 1rem;
    margin-right: 1rem;
  }
  .postItem-wrapper {
    flex-flow: nowrap !important;
  }

  .POSItemOptions_quantity {
    display: grid !important;
    grid-template-columns: 2fr 2fr 2fr;
    padding: 4px;
  }
  .pos-quantity-wrapper {
    display: flex !important;
  }
  .POSItemOptions_quantity_submit {
    @include responsive(mobile) {
      width: 7.75rem !important;
      font-size: 1rem !important;
    }
  }
}
</style>
