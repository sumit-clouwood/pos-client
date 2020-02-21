<template>
  <div class="modal fade" id="business-summary" role="dialog" v-if="BSData">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Business Summary Details') }}
          </h4>
        </div>
        <div class="modal-body row business-summary">
          <div class="business-summary-wrapper">
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>
                      {{ _t('Sales') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th>
                      {{ _t('Value') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ _t('Gross Sales') }}</td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_CALCULATED_GROSS_SALES) }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ _t('Item Discounts') }}</td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_ITEM_DISCOUNT_VALUE) }}
                    </td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td>{{ _t('Order Discounts') }}</td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_ORDER_DISCOUNT) }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ _t('Net Sales Before Surcharge') }}</td>
                    <td class="align-right">
                      {{
                        formatPrice(
                          BSData.REPORT_CALCULATED_NET_SALES_BEFORE_SURCHARGE
                        )
                      }}
                    </td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td>{{ _t('Surcharges') }}</td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_ORDER_SURCHARGE) }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ _t('Net Sales') }}</td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_ORDER_SALES) }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ _t('Tax') }}</td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_ORDER_TAX) }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ _t('Total Collected') }}</td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_CALCULATED_TOTAL_SALES) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>
                      {{ _t('Orders') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th>
                      {{ _t('Oty') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ _t('Total Orders') }}</td>
                    <td class="align-right">
                      {{ BSData.REPORT_ORDER_COUNT }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ _t('Cancelled Orders') }}</td>
                    <td class="align-right">
                      {{ BSData.REPORT_ORDER_CANCEL_REASON_QUANTITY }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ _t('Modified Orders') }}</td>
                    <td class="align-right">
                      {{ BSData.REPORT_MODIFY_REASON_QUANTITY }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ _t('Not Finished Orders') }}</td>
                    <td class="align-right">
                      {{ BSData.REPORT_IN_PROGRESS_QUANTITY }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>
                      {{ _t('Payment Types') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th>
                      {{ _t('Qty') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th>
                      {{ _t('Value') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(payment, index) in BSData.PAYMENT_TYPES"
                    :key="index"
                  >
                    <td>
                      {{ _t(payment['REPORT-PAYMENT-TYPE-NAME']) }}
                    </td>
                    <td class="align-right">
                      {{ payment['REPORT-PAYMENT-TYPE-QUANTITY'] }}
                    </td>
                    <td class="align-right">
                      {{ formatPrice(payment['REPORT-PAYMENT-TYPE']) }}
                      <!--{{ setTotalValue(payment['REPORT-PAYMENT-TYPE']) }}-->
                    </td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td>{{ _t('Total') }}</td>
                    <td class="align-right">
                      {{ totalPayments.count }}
                    </td>
                    <td class="align-right">
                      {{ totalPayments.value }}
                    </td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td>{{ _t('Tips') }}</td>
                    <td class="align-right">
                      1
                    </td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_TIPS_VALUE) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="BSData.REPORT_DINEIN_PANDDING_ORDER_COUNT"
                  >
                    <td>{{ _t('Unfinished Dine-In Orders') }}</td>
                    <td class="align-right">
                      {{ BSData.REPORT_DINEIN_PANDDING_ORDER_COUNT }}
                    </td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_DINEIN_PANDDING_ORDER) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="BSData.REPORT_CAPHOP_PANDDING_ORDER_COUNT"
                  >
                    <td>{{ _t('Carhop') }}</td>
                    <td class="align-right">
                      {{ BSData.REPORT_CAPHOP_PANDDING_ORDER_COUNT }}
                    </td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_CAPHOP_PANDDING_ORDER) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="BSData.REPORT_ITEM_REFERRAL_QUANTITY"
                  >
                    <td>{{ _t('Carhop') }}</td>
                    <td class="align-right">
                      {{ BSData.REPORT_ITEM_REFERRAL_QUANTITY }}
                    </td>
                    <td class="align-right">
                      {{ formatPrice(BSData.REPORT_ITEM_REFERRAL_VALUE) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              data-dismiss="modal"
            >
              {{ _t('Ok') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Select Discount -->
</template>
<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'BusinessSummary',
  data() {
    return {
      // total: { value: 0, count: 0 },
    }
  },
  computed: {
    ...mapGetters('location', ['_t', 'formatPrice']),
    ...mapState('reports', ['BSData', 'totalPayments']),
  },
}
</script>
