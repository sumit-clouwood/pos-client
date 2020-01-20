<template>
  <div
    class="tab-pane fade color-dashboard-background"
    id="nav-payments"
    role="tabpanel"
    aria-labelledby="nav-payments-tab"
  >
    {{ getReferral() }}
    <div v-if="orderDetails">
      <table
        class="table-responsive"
        v-if="appliedReferral && orderDetails.order_type === 'call_center'"
      >
        <tr class="receipt-body color-secondary color-text-invert">
          <th class="receipt-heading">{{ _t('Payment Method') }}</th>
          <!--<th class="receipt-heading">{{ _t('Referral Type') }}</th>-->
          <th class="receipt-heading">{{ _t('Collected') }}</th>
        </tr>
        <tr class="receipt-body color-tables-background color-text">
          <td>{{ appliedReferral.name }}</td>
          <!--<td>{{ appliedReferral.referral_type }}</td>-->
          <td class="base-price">
            {{ orderDetails.balance_due }}
          </td>
        </tr>
      </table>

      <table
        class="table-responsive"
        v-else-if="orderDetails.order_payments.length"
      >
        <tr class="receipt-body color-secondary color-text-invert">
          <th class="receipt-heading">{{ _t('Payment Method') }}</th>
          <th class="receipt-heading">{{ _t('Collected') }}</th>
        </tr>
        <tr
          class="receipt-body color-tables-background color-text"
          v-for="(item, index) in orderDetails.order_payments"
          :key="index"
        >
          <td>{{ item.name }}</td>
          <td class="base-price">{{ item.collected }}</td>
        </tr>
      </table>

      <div v-else>
        <h5 class="text-center pt-2 pb-3">{{ _t('No matching records') }}s</h5>
      </div>
    </div>

    <div v-else>
      <h5 class="text-center pt-2 pb-3">{{ _t('No matching records') }}s</h5>
    </div>

    <div v-if="orderDetails">
      <div
        class="receipt-summary"
        v-if="appliedReferral && orderDetails.order_type === 'call_center'"
      >
        <div class="caption subtotal color-text-invert">
          {{ _t('Total Paid') }}:
        </div>
        <div class="subtotal color-text">
          {{ formatPrice(orderDetails.balance_due) }}
        </div>
      </div>
      <div class="receipt-summary" v-else>
        <div class="caption subtotal color-text-invert">
          {{ _t('Total Paid') }}:
        </div>
        <div class="subtotal color-text">
          {{ formatPrice(orderDetails.total_paid) }}
        </div>
        <!---->
        <div class="caption color-text-invert">{{ _t('Amount Changed') }}:</div>
        <div class="color-text">
          {{ orderDetails.amount_changed }}
        </div>
        <div class="caption color-text-invert">{{ _t('Tips') }}:</div>
        <div class="color-text">
          {{ orderDetails.tip_amount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Payment',
  props: {
    orderDetails: {},
    lookups: {},
  },
  data() {
    return {
      appliedReferral: false,
    }
  },
  computed: {
    ...mapGetters('location', ['_t', 'formatPrice']),
  },
  methods: {
    getReferral() {
      if (this.lookups && typeof this.lookups.brand_referrals !== 'undefined') {
        this.appliedReferral =
          this.lookups.brand_referrals._id[this.orderDetails.referral] || false
      }
    },
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
