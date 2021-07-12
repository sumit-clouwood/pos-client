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
          <!--          <div>
            <label class="container-checkbox"
              >{{ _t('Store Time') }}
              <input
                type="checkbox"
                @click="getBSStoreTime"
                v-model="timeMode"
              />
              <span class="checkmark"></span>
            </label>
          </div>-->
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
          <div class="bs-datetime-selector">
            <form>
              <datetime
                type="date"
                title="Date from"
                v-model="getSetDateFrom"
                placeholder="Date from"
                value-zone="local"
                zone="local"
                input-class="btn schedule-input btn-large datepicker-here color-dashboard-background"
                :format="{
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }"
                auto
              ></datetime>
              <datetime
                type="date"
                v-model="getSetDateTo"
                title="Date to"
                placeholder="Date to"
                value-zone="local"
                zone="local"
                input-class="btn schedule-input btn-large datepicker-here color-dashboard-background"
                :format="{
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }"
                :week-start="7"
                auto
                :phrases="{ ok: 'oK', cancel: 'Exit' }"
              ></datetime>
              <button
                class="btn btn-success btn-large color-main"
                type="button"
                v-on:click="getReport"
              >
                <i class="fa fa-refresh fa"></i>
                <!--{{ _t('Get Report') }}-->
              </button>
            </form>
          </div>
        </div>
        <div class="modal-body row business-summary" v-if="loader">
          <Preloader />
        </div>
        <div
          v-else
          class="modal-body row business-summary"
          id="print_bs"
          style="font-family: sans-serif; font-weight: bold"
        >
          <div
            style="width: 100%;
            text-align: center;
            margin-bottom: 15px;
            margin-top: 7px;"
          >
            <img
              style="width: 155px;
        min-width: 155px;
        display: inline-block;
        margin: 0 auto 1.2em;"
              :src="company_logo"
              alt="Logo"
            />
            <h4
              style="text-align: center; padding-bottom:5px; margin-bottom: 0"
            >
              {{ store.name }}
            </h4>
            <small class="date">
              {{ _t('Current datetime') }} {{ todayDate }}
              <span style="text-transform: uppercase">
                {{ todayTime }}
              </span></small
            >
            <br />
            <small class="date" v-if="date_from !== 'Invalid date'">
              {{ _t('Report from') }} {{ date_from }}</small
            >
            -
            <small class="date" v-if="date_to !== 'Invalid date'">
              {{ _t('To') }} {{ date_to }}
            </small>
            <br />
            <small>{{ _t('Printed by') }}: {{ user.name }}</small>
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
                  <template v-for="(payment, index) in BSData.PAYMENT_TYPES">
                    <tr
                      style="border: 1px dashed #000; margin-top: 10px"
                      v-if="parseFloat(payment['REPORT-PAYMENT-TYPE']) > 0.01"
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
                  </template>
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
                    v-if="
                      BSData.REPORT_DINEIN_PANDDING_ORDER_COUNT &&
                        parseFloat(BSData.REPORT_DINEIN_PANDDING_ORDER) > 0.01
                    "
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Uncollected Dine-In Orders') }}
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
                    v-if="
                      BSData.REPORT_CRM_PANDDING_ORDER_COUNT &&
                        parseFloat(BSData.REPORT_CRM_PANDDING_ORDER) > 0.01
                    "
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
                    v-if="
                      BSData.REPORT_CAPHOP_PANDDING_ORDER_COUNT &&
                        parseFloat(BSData.REPORT_CAPHOP_PANDDING_ORDER) > 0.01
                    "
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Uncollected Carhop Orders') }}
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
                    v-if="
                      BSData.REPORT_TAKEAWAY_PANDDING_ORDER_COUNT &&
                        parseFloat(BSData.REPORT_TAKEAWAY_PANDDING_ORDER) > 0.01
                    "
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Uncollected Takeaway Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_TAKEAWAY_PANDDING_ORDER_COUNT }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ formatPrice(BSData.REPORT_TAKEAWAY_PANDDING_ORDER) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="
                      BSData.REPORT_CAPHOP_UNPAID_ORDER_COUNT &&
                        parseFloat(BSData.REPORT_CAPHOP_UNPAID_ORDER) > 0.01
                    "
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Unpaid Carhop Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_CAPHOP_UNPAID_ORDER_COUNT }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ formatPrice(BSData.REPORT_CAPHOP_UNPAID_ORDER) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="
                      BSData.REPORT_TAKEAWAY_UNPAID_ORDER_COUNT &&
                        parseFloat(BSData.REPORT_TAKEAWAY_UNPAID_ORDER) > 0.01
                    "
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Unpaid Takeaway Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_TAKEAWAY_UNPAID_ORDER_COUNT }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ formatPrice(BSData.REPORT_TAKEAWAY_UNPAID_ORDER) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="
                      BSData.REPORT_DINEIN_UNPAID_ORDER_COUNT &&
                        parseFloat(BSData.REPORT_DINEIN_UNPAID_ORDER) > 0.01
                    "
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Unpaid Dine-In Orders') }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ BSData.REPORT_DINEIN_UNPAID_ORDER_COUNT }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ formatPrice(BSData.REPORT_DINEIN_UNPAID_ORDER) }}
                    </td>
                  </tr>
                  <tr
                    class="font-weight-bold"
                    v-if="
                      BSData.REPORT_ITEM_REFERRAL_QUANTITY &&
                        parseFloat(BSData.REPORT_ITEM_REFERRAL_VALUE) > 0.01
                    "
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t('Credit Referrals') }}
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
                      {{ _t('Item Names') }}
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
                      {{ _t('Qty %') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th
                      style="border: 1px dashed #000; margin-top: 15px;
                      text-align: left;padding: 0.3rem; border-left: 0;"
                    >
                      {{ _t('Value') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th
                      style="border: 1px dashed #000; margin-top: 15px;
                      text-align: left;padding: 0.3rem; border-left: 0;"
                    >
                      {{ _t('Value %') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th
                      style="border: 1px dashed #000; margin-top: 15px;
                      text-align: left;padding: 0.3rem; border-left: 0;"
                    >
                      {{ _t('Weight') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style="border: 1px dashed #000; margin-top: 10px"
                    v-for="(item, index) in BSData.REPORT_ITEM"
                    :key="index"
                  >
                    <td
                      style="border-right: 1px dashed #000;
                      border-left: 1px dashed #000;
                      text-align: left;padding: 0.3rem;"
                    >
                      {{ _t(item['REPORT-ITEM-NAME']) }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ item['REPORT-ITEM-QUANTITY'] }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{
                        getPercentage(
                          getItemTotalQty,
                          item['REPORT-ITEM-QUANTITY']
                        )
                      }}
                      %
                    </td>
                    <td
                      style="padding-left: 10px;
                     border-right: 1px dashed #000"
                    >
                      {{ formatPrice(item['REPORT-ITEM-VALUE']) }}
                    </td>
                    <td
                      style="padding-left: 10px;
                     border-right: 1px dashed #000"
                    >
                      {{
                        getPercentage(getItemTotal, item['REPORT-ITEM-VALUE'])
                      }}
                      {{ _t('% of') }} {{ currency }}
                    </td>
                    <td
                      style="padding-left: 10px;
                     border-right: 1px dashed #000"
                    >
                      {{ item['REPORT-ITEM-QUANTITY-MEASUREMENT'] }}
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
                      {{ getItemTotalQty }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    ></td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    >
                      {{ formatPrice(getItemTotal) }}
                    </td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    ></td>
                    <td
                      style="padding-left: 10px;
                      border-right: 1px dashed #000"
                    ></td>
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
              v-if="!loader"
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
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import moment from 'moment-timezone'
import { Datetime } from 'vue-datetime'
import Preloader from '@/components/util/Preloader'
import Num from '@/plugins/helpers/Num'

export default {
  name: 'BusinessSummary',
  data() {
    return {
      // timeMode: this.time_mode,
      todayDate: moment().format('Do MMMM YYYY'),
      todayTime: moment().format('h:mm:ss a'),
    }
  },
  components: {
    Preloader,
    Datetime,
  },
  mounted() {
    this.toDataURL(
      this.company_logo,
      base64 => {
        this.company_logo = base64
      },
      'image/png'
    )
  },
  computed: {
    ...mapGetters('location', ['_t', 'formatPrice']),
    ...mapState('reports', [
      'BSData',
      'totalPayments',
      'date_from',
      'date_to',
      'loader',
    ]),
    ...mapState('location', ['store', 'timezoneString', 'currency']),
    ...mapState({ user: state => state.auth.userDetails.item }),
    getSetDateFrom: {
      get() {
        return this.date_from
      },
      set(dateFrom) {
        let _from = moment(dateFrom).format('YYYY-MM-DD')
        this.$store.commit('reports/DATE_FROM', _from)
      },
    },
    getItemTotal() {
      let total = 0
      if (this.BSData && this.BSData.REPORT_ITEM) {
        let reportItem = this.BSData.REPORT_ITEM
        for (const item in reportItem) {
          total += parseFloat(reportItem[item]['REPORT-ITEM-VALUE'])
        }
      }
      return total
    },
    getItemTotalQty() {
      let total = 0
      if (this.BSData && this.BSData.REPORT_ITEM) {
        let reportItem = this.BSData.REPORT_ITEM
        for (const item in reportItem) {
          total += parseFloat(reportItem[item]['REPORT-ITEM-QUANTITY'])
        }
      }
      return total
    },
    getSetDateTo: {
      get() {
        return this.date_to
      },
      set(dateTo) {
        let _to = moment(dateTo).format('YYYY-MM-DD')
        this.$store.commit('reports/DATE_TO', _to)
      },
    },
    company_logo() {
      return this.$store.state.location.brand &&
        this.$store.state.location.brand.company_logo
        ? this.$store.state.location.brand.company_logo
        : ''
    },
  },
  methods: {
    getPercentage(total, value) {
      let amount = (value / total) * 100
      return Num.round(amount, 2).toFixed(2)
    },
    /*getBSStoreTime() {
      this.timeMode = !this.timeMode
      this.$store.commit('reports/TIME_MODE', this.timeMode)
      this.getReport()
    },*/
    getReport() {
      this.$store.dispatch('reports/businessSummary', {}, { root: true })
    },
    toDataURL(src, callback, outputFormat) {
      var img = new Image()
      img.crossOrigin = 'Anonymous'

      img.src = src
      if (img.complete || img.complete === undefined) {
        img.src =
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
        img.src = src
      }

      img.onload = function() {
        var canvas = document.createElement('CANVAS')
        var ctx = canvas.getContext('2d')
        var dataURL
        canvas.height = this.naturalHeight
        canvas.width = this.naturalWidth
        ctx.drawImage(this, 0, 0)
        dataURL = canvas.toDataURL(outputFormat)
        callback(dataURL)
      }
    },
    printBS() {
      let dt = this.$store.state.auth.deviceType
      let isIOS = dt.osType
      if (!isIOS) {
        this.bsPrint('print_bs')
      } else {
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('iosprint_bs', '1')
        window.location.search = urlParams
      }
      // Pass the element id here
    },
    bsPrint(el) {
      const url = ''
      let name = '_blank'
      let specs = ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes']
      let replace = true
      // let styles = []
      const win = window.open(url, name, specs, replace)
      specs = specs.length ? specs.join(',') : ''

      const element = document.getElementById(el)

      if (!element) {
        alert(`Element to print #${el} not found!`)
        return
      }
      win.document.write(`
        <html>
          <head>
            <title>${this._t('Business Summary Details')}</title>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `)
      // addStyles(win, styles)

      setTimeout(() => {
        win.document.close()
        win.focus()
        win.print()
        // win.close()
        // cb()
      }, 1000)
      setTimeout(() => {
        win.close()
      }, 3000)
      return true
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
.preloader {
  width: 100%;
}
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
.bs-datetime-selector {
  display: grid;
  left: 3px;
  grid-template-columns: auto auto auto;
  grid-column-gap: 5px;
  position: absolute;
  align-items: baseline;
  top: 80px;
  z-index: 9;
}
.bs-datetime-selector .vdatetime {
  margin-left: 5px;
}
.bs-datetime-selector button {
  margin-left: 5px;
  height: 42px;
  width: 41px;
}
/*.vdatetime-popup {
  top: 12% !important;
}*/
.business-summary {
  max-height: 480px;
  overflow-x: scroll;
}
@media only screen and (max-width: 599px) {
  .business-summary {
    top: 60px;
  }
}
</style>
