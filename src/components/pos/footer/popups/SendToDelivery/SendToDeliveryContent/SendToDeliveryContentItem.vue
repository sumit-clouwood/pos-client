<template>
  <div class="order-table">
    <table class="table table-responsive" v-if="cartItems">
      <tr>
        <th
          class="text-uppercase color-secondary color-text-invert"
          style="width: 300px"
        >
          {{ _t('Item Name') }}
        </th>
        <th
          class="text-uppercase color-secondary color-text-invert"
          style="width: 100px"
        >
          {{ _t('Qty') }}
        </th>
        <th
          class="text-uppercase color-secondary color-text-invert"
          style="width: 150px"
        >
          {{ _t('Price') }}
        </th>
        <!--<th class="text-uppercase" style="width: 100px">{{ _t('Tax') }}</th>-->
        <th
          class="text-uppercase color-secondary color-text-invert"
          style="width: 150px"
        >
          {{ _t('Sub Total') }}
        </th>
      </tr>
      <tr v-for="(item, index) in cartItems" :key="index">
        <td class="color-tables-background color-text">{{ item.name }}</td>
        <td class="color-tables-background color-text">{{ item.quantity }}</td>
        <td class="color-tables-background color-text">
          {{ formatPrice(item.netPrice || 0) }}
        </td>
        <!--<td>{{ formatPrice(taxAmount(item.tax_sum) || 0) }}</td>-->
        <td class="color-tables-background color-text">
          {{ formatPrice(subtotal(item.quantity, item.netPrice) || 0) }}
        </td>
      </tr>
    </table>

    <div class="text-center color-text" v-if="!cartItems">
      {{ _t('No Items Added in Cart') }}
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'SendToDeliveryContentItem',
  props: {},
  computed: {
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState({
      cartItems: state =>
        state.order && state.order.items.length > 0 ? state.order.items : false,
    }),
  },
  methods: {
    taxAmount: function(taxArr) {
      if (typeof taxArr != 'undefined') {
        let calculetedTaxAmount = 0
        taxArr.length > 0
          ? taxArr.forEach(tax => {
              calculetedTaxAmount += parseFloat(tax.tax_amount)
            })
          : 0
        return calculetedTaxAmount
      }
    },
    subtotal: function(quantity, price) {
      let subtotal = isNaN(parseFloat(price) * parseInt(quantity))
        ? 0.0
        : parseFloat(price) * parseInt(quantity)
      return subtotal
    },
  },
}
</script>
