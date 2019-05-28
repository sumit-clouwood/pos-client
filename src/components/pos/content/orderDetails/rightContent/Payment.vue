<template>
  <div
    class="tab-pane fade"
    id="nav-payments"
    role="tabpanel"
    aria-labelledby="nav-payments-tab"
  >
    <table class="table-responsive">
      <tr class="receipt-body">
        <th class="receipt-heading">PAYMENT METHOD NAME</th>
        <th class="receipt-heading">COLLECTED</th>
      </tr>
      <tr
        class="receipt-body"
        v-for="(item, index) in orderDetails.order_payments"
        :key="index"
      >
        <td>{{ item.name }}</td>
        <td class="base-price">{{ item.collected }}</td>
      </tr>
    </table>

    <div class="receipt-summary">
      <div class="caption subtotal">
        TOTAL PAID:
      </div>
      <div class="subtotal">
        {{ orderDetails.total_paid }}
      </div>
      <!---->
      <div class="caption">
        CHANGED CASH:
      </div>
      <div>
        {{ orderDetails.amount_changed }}
      </div>
      <div class="caption">
        TIPS:
      </div>
      <div>
        {{ orderDetails.tip_amount }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Payment',
  props: {
    orderDetails: {},
  },
}
</script>
<style scoped lang="scss">
.receipt-body {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  grid-column-gap: 1.25rem;
  line-height: 2.2;
  vertical-align: middle;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.receipt-summary {
  border-top: 1px solid gray;
}
.receipt-heading {
  text-transform: uppercase;
  border-bottom: 1px solid gray;
  font-weight: 500;
}
.receipt-summary,
.payments_summary {
  display: grid;
  grid-template-columns: 1fr auto;
  text-align: right;
  grid-column-gap: 1.25rem;
  text-transform: uppercase;
  line-height: 2.5;
}
.caption {
  font-size: 12px !important;
  font-weight: 400;
}
.receipt-summary .caption,
.payments_summary .caption {
  color: gray;
}
</style>
