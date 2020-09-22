<template>
  <div class="modal fade" id="business-summary" role="dialog" v-if="BSData">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Business Summary Details') }}
          </h4>
          <div>
            <label class="container-checkbox"
              >{{ _t('Store Time') }}
              <input
                type="checkbox"
                @click="getBSStoreTime"
                v-model="timeMode"
              />
              <span class="checkmark"></span>
            </label>
          </div>
          <!--<div class="printConfg">
            <label>
              <input
                @click="getBSStoreTime"
                type="checkbox"
                v-model="timeMode"
                name="printcong"
                id="printcongs"
              />
            </label>
            <label> Store</label>
          </div>-->
        </div>
        <div
          class="modal-body row business-summary"
          id="print_bs"
          style="font-family: sans-serif; font-weight: bold"
        >
          <div style="width: 100%; text-align: center; margin-bottom: 15px;">
            <h4
              style="text-align: center; padding-bottom:5px; margin-bottom: 0"
            >
              {{ store.name }}
            </h4>
            <small class="date">{{ todayDate }}</small
            ><br />
            <small class="date" style="text-transform: uppercase">
              {{ todayTime }} </small
            ><br />
            <small>{{ user.name }}</small>
          </div>
          <div class="business-summary-wrapper" style="text-align: center">
            <div class="table-responsive">
              <table
                style="margin-bottom: 20px; width: 98%;
                border-bottom: 1px dashed #000;
                font-size: 12px; font-family: sans-serif;"
              >
                <thead>
                  <tr style="border: 1px dashed #000">
                    <th
                      style="border: 1px dashed #000;
                      text-align: left;padding: 0.3rem; width: 60%"
                    >
                      {{ _t('Sales') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th
                      style="border: 1px dashed #000; border-left: 0;
                      text-align: left;padding: 0.3rem; width: 40%"
                    >
                      {{ _t('Value') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem; width: 60%"
                    >
                      {{ _t('Gross Sales') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000; width: 40%"
                    >
                      {{ formatPrice(BSData.REPORT_CALCULATED_GROSS_SALES) }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem; width: 60% "
                    >
                      {{ _t('Item Discounts') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000; width: 40%"
                    >
                      {{ formatPrice(BSData.REPORT_ITEM_DISCOUNT_VALUE) }}
                    </td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem; width: 60%"
                    >
                      {{ _t('Order Discounts') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000; width: 40%"
                    >
                      {{ formatPrice(BSData.REPORT_ORDER_DISCOUNT) }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Net Sales Before Surcharge') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{
                        formatPrice(
                          BSData.REPORT_CALCULATED_NET_SALES_BEFORE_SURCHARGE
                        )
                      }}
                    </td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem; width: 60%"
                    >
                      {{ _t('Surcharges') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000; width: 40%"
                    >
                      {{ formatPrice(BSData.REPORT_ORDER_SURCHARGE) }}
                    </td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem; width: 60%"
                    >
                      {{ _t('Delivery Surcharges') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000; width: 40%"
                    >
                      {{ formatPrice(BSData.REPORT_DELIVERY_SURCHARGE_VALUE) }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem; width: 60%"
                    >
                      {{ _t('Net Sales') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000; width: 40%"
                    >
                      {{ formatPrice(BSData.REPORT_ORDER_SALES) }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem; width: 60%"
                    >
                      {{ _t('Tax') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000;width: 40% "
                    >
                      {{ formatPrice(BSData.REPORT_ORDER_TAX) }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem; width: 60% "
                    >
                      {{ _t('Total Collected') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000;  width: 40%"
                    >
                      {{ formatPrice(BSData.REPORT_CALCULATED_TOTAL_SALES) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive">
              <table
                style="margin-bottom: 20px;
                border-bottom: 1px dashed #000;
                font-size: 12px; font-family: sans-serif; width: 98%"
              >
                <thead>
                  <tr>
                    <th
                      style="border: 1px dashed #000; margin-top: 15px;
                      text-align: left;padding: 0.3rem; width: 60%"
                    >
                      {{ _t('Orders') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th
                      style="border: 1px dashed #000; margin-top: 15px;
                      text-align: left;padding: 0.3rem;
                      width: 40%; border-left: 0;"
                    >
                      {{ _t('Oty') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000; width: 60%;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Total Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px; width: 40%;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_ORDER_COUNT }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Cancelled Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_ORDER_CANCEL_REASON_QUANTITY }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Modified Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_MODIFY_REASON_QUANTITY }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Refunded Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_ORDER_REFUND_REASON_QUANTITY }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Not Finished Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_IN_PROGRESS_QUANTITY }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive">
              <table
                style="margin-bottom: 20px;
                width: 98%; font-family: sans-serif;;
                border-bottom: 1px dashed #000; font-size: 12px"
              >
                <thead>
                  <tr>
                    <th
                      style="border: 1px dashed #000; margin-top: 15px;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Payment Types') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th
                      style="border: 1px dashed #000; margin-top: 15px;
                      text-align: left;padding: 0.3rem; border-left: 0;"
                    >
                      {{ _t('Qty') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th
                      style="border: 1px dashed #000; margin-top: 15px;
                      text-align: left;padding: 0.3rem; border-left: 0;"
                    >
                      {{ _t('Value') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style="border: 1px dashed #000; margin-top: 10px"
                    v-for="(payment, index) in BSData.PAYMENT_TYPES"
                    :key="index"
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t(payment['REPORT-PAYMENT-TYPE-NAME']) }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ payment['REPORT-PAYMENT-TYPE-QUANTITY'] }}
                    </td>
                    <td
                      style="padding-left: 10px;
                     border-right: 1px dashed #000"
                    >
                      {{ formatPrice(payment['REPORT-PAYMENT-TYPE']) }}
                      <!--{{ setTotalValue(payment['REPORT-PAYMENT-TYPE']) }}-->
                    </td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Total') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ totalPayments.count }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ formatPrice(totalPayments.value) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="BSData.REPORT_TIPS_VALUE > 0"
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Tips') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    ></td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ formatPrice(BSData.REPORT_TIPS_VALUE) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="BSData.REPORT_DINEIN_PANDDING_ORDER_COUNT"
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Unfinished Dine-In Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_DINEIN_PANDDING_ORDER_COUNT }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ formatPrice(BSData.REPORT_DINEIN_PANDDING_ORDER) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="BSData.REPORT_CRM_PANDDING_ORDER_COUNT"
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Undelivered CRM Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_CRM_PANDDING_ORDER_COUNT }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ formatPrice(BSData.REPORT_CRM_PANDDING_ORDER) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="BSData.REPORT_CAPHOP_PANDDING_ORDER_COUNT"
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Unfinished Carhop Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_CAPHOP_PANDDING_ORDER_COUNT }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ formatPrice(BSData.REPORT_CAPHOP_PANDDING_ORDER) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="BSData.REPORT_ITEM_REFERRAL_QUANTITY"
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Referral') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_ITEM_REFERRAL_QUANTITY }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
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
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              @click="printBS"
            >
              {{ _t('Print') }}
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
import moment from 'moment-timezone'

export default {
  name: 'BusinessSummary',
  data() {
    return {
      timeMode: this.time_mode,
      todayDate: moment().format('Do MMMM YYYY'),
      todayTime: moment().format('h:mm:ss a'),
    }
  },
  computed: {
    ...mapGetters('location', ['_t', 'formatPrice']),
    ...mapState('reports', ['BSData', 'totalPayments', 'time_mode']),
    ...mapState('location', ['store']),
    ...mapState({ user: state => state.auth.userDetails.item }),
  },
  methods: {
    getBSStoreTime() {
      this.timeMode = !this.timeMode
      this.$store.commit('reports/TIME_MODE', this.timeMode)
      this.$store.dispatch('reports/businessSummary', {}, { root: true })
    },
    printBS() {
      // Pass the element id here
      this.$htmlToPaper('print_bs')
    },
  },
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
  ],
  specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
}
</script>
<style>
@media print {
  @page {
    size: landscape;
  }
}
/* The container */
.container-checkbox {
  display: block;
  position: relative;
  padding-left: 26px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
/*.modal .modal-dialog .modal-content .modal-footer {
  text-align: right;
  padding: 0 1.875rem 1.875rem 1.875rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: inline-block;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}*/
/* Hide the browser's default checkbox */
.container-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom checkbox */
.container-checkbox .checkmark {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container-checkbox:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container-checkbox input:checked ~ .checkmark {
  background-color: #5056ca;
}

/* Create the checkmark/indicator (hidden when not checked) */
.container-checkbox .checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container-checkbox input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container-checkbox .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
