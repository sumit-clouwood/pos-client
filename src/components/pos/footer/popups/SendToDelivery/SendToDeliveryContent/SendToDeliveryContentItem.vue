<template>
  <div class="order-table">
    <table class="table table-responsive" v-if="cartItems">
      <tr>
        <th style="width: 300px">ITEM NAME</th>
        <th style="width: 100px">QTY</th>
        <th style="width: 150px">PRICE</th>
        <th style="width: 100px">TAX</th>
        <th style="width: 150px">SUBTOTAL</th>
      </tr>
      <tr v-for="(item, index) in cartItems" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.price }}</td>
        <td>{{ taxAmount(item.item_tax) }}</td>
        <td>{{ subtotal(item.quantity, item.price) }}</td>
      </tr>
    </table>

    <div class="text-center" v-if="!cartItems">No Items Added in Cart</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SendToDeliveryContentItem',
  props: {},
  computed: {
    ...mapState({
      cartItems: state =>
        state.order.items.length > 0 ? state.order.items : false,
    }),
  },
  methods: {
    taxAmount: function(taxArr) {
      let calculetedTaxAmount = 0
      taxArr.length > 0
        ? taxArr.forEach(tax => {
          calculetedTaxAmount += parseFloat(tax.tax_amount)
        })
        : 0
      return calculetedTaxAmount
    },
    subtotal: function(quantity, price) {
      return parseFloat(price) * parseInt(quantity)
    },
  },
}
</script>
