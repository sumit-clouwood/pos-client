<template>
  <div class="modal fade" id="delivery-manager" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->

      <div class="modal-content" v-if="selectedOrder">
        <div class="modal-body dm-confirmation-wrap dm-con">
          <div class="dm-ready-order-wrap">
            <div class="dm-ready-order-left">
              <div class="dm-ready" v-if="selectedOrder.customer">
                <p>{{ _t('Customer Name:') }}</p>
                <h5>{{ selectedOrder.customer.customer_name }}</h5>
              </div>
              <div class="dm-ready" v-if="selectedOrder.customer">
                <p>{{ _t('Phone Number:') }}</p>
                <h5>{{ selectedOrder.customer.mobile_number }}</h5>
              </div>
              <div class="dm-ready">
                <p>{{ _t('Location/Branch:') }}</p>
                <h5>{{ locationName }}</h5>
              </div>
              <div class="dm-ready">
                <p>{{ _t('Staff:') }}</p>
                <h5>{{ selectedOrder.created_by }}</h5>
              </div>
            </div>
            <div class="dm-ready-order-right">
              <div class="dm-ready">
                <p>{{ _t('Order Number:') }}</p>
                <h5>{{ selectedOrder.order_no }}</h5>
              </div>
              <div class="dm-ready" v-if="selectedOrder.delivery_area">
                <p>{{ _t('Delivery Area:') }}</p>
                <h5>{{ selectedOrder.delivery_area }}</h5>
              </div>
              <div class="dm-ready" v-if="selectedOrder.delivery_area">
                <p>{{ _t('Delivery Address:') }}</p>
                <h5>
                  {{ selectedOrder.delivery_area }},
                  {{ selectedOrder.order_address.street }},
                  {{ selectedOrder.city }}
                </h5>
              </div>
            </div>
            <div id="dm-payment-type-order">
              <p class="payments-title">{{ _t('Payments :') }}</p>
              <div class="order-table">
                <table class="table table-responsive">
                  <tr>
                    <th style="width: 500px">{{ _t('Paid By') }}</th>
                    <th style="width: 200px">{{ _t('Amount') }}</th>
                    <th style="width: 150px">{{ _t('Collected') }}</th>
                    <th style="width: 150px">{{ _t('Returned') }}</th>
                  </tr>
                  <tr
                    class="pay-tot-amt"
                    v-for="(payment, index) in selectedOrder.payment_info"
                    :key="index"
                  >
                    <td>{{ payment.payment_mode }}</td>
                    <td>{{ formatPrice(payment.payment_amount) }}</td>
                    <td>{{ formatPrice(collectedAmount(payment)) }}</td>
                    <td>
                      {{
                        returnedAmount(
                          payment.payment_mode,
                          selectedOrder.amount_changed
                        )
                      }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div
            class="dm-order-confirmation displayBlock"
            id="dm-order-confirmation"
          >
            <div class="order-table">
              <table class="table table-responsive">
                <tr>
                  <th style="width: 500px">{{ _t('ITEM NAME') }}</th>
                  <th style="width: 105px">{{ _t('QTY') }}</th>
                  <th style="width: 150px">{{ _t('PRICE') }}</th>
                  <th style="width: 150px">{{ _t('TAX') }}</th>
                  <th style="width: 200px">{{ _t('SUB-PRICE') }}</th>
                </tr>
                <!--<tr class="pay-tot-amt modifier-item-item">
                                    <td colspan="4"><a class="modifier-dm" role="button">Bolognese Sauce</a> <a class="modifier-dm" role="button">Bolognese Sauce</a> <a class="modifier-dm" role="button">Bolognese Sauce</a></td>
                                </tr>-->
                <tr
                  v-for="(item, itemIndex) in selectedOrder.items"
                  :key="itemIndex"
                >
                  <td>
                    {{ item.item_name }}
                    <div class="head1" v-if="item.item_modifiers.length">
                      <i
                        class="fa fa-leaf categoryColorContainer green-txt"
                      ></i>
                    </div>
                    <div
                      v-if="item.item_modifiers.length"
                      class="online-order-details-wrap"
                    >
                      <div
                        v-for="(modifier, index) in item.item_modifiers"
                        :key="index"
                      >
                        <p
                          v-for="PMDetails in modifier.modifiers
                            .price_modifiers"
                          :key="PMDetails._id"
                        >
                          {{ PMDetails.item_name }} ({{
                            PMDetails.location_price
                          }})
                        </p>
                        <p
                          v-for="MMDetails in modifier.modifiers
                            .mandatory_modifiers"
                          :key="MMDetails._id"
                        >
                          {{ MMDetails.item_name }}
                        </p>
                        <p
                          v-for="RMDetails in modifier.modifiers
                            .regular_modifiers"
                          :key="RMDetails._id"
                        >
                          {{ RMDetails.item_name }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{{ item.item_quantity }}</td>
                  <td>{{ formatPrice(item.item_price_each) }}</td>
                  <td>{{ formatPrice(item.item_tax_amount) }}</td>
                  <td>{{ formatPrice(item.item_price_total) }}</td>
                </tr>
              </table>
            </div>
            <div id="dm-order-past-wrap" class="total-order">
              <div class="order-confirm-amt" id="dm-confirm-order-tab">
                <div class="order-amt-title">
                  <p>{{ _t('SUBTOTAL :') }}</p>
                  <p>{{ _t('SURCHARGE :') }}</p>
                  <p>{{ _t('ORDER DISCOUNT :') }}</p>
                  <p>{{ _t('TAX :') }}</p>
                  <p>{{ _t('BILL AMOUNT :') }}</p>
                </div>
                <div class="order-amt-charges">
                  <p>
                    {{ formatPrice(selectedOrder.subtotal) }}
                  </p>
                  <p>
                    {{ formatPrice(selectedOrder.surcharge) }}
                  </p>
                  <p>
                    {{ formatPrice(selectedOrder.discount_amount) }}
                  </p>
                  <p>
                    {{ formatPrice(selectedOrder.final_tax) }}
                  </p>
                  <p>
                    {{ formatPrice(selectedOrder.balance_due) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- DM popup history -->

          <div class="dm-order-confirmation" id="dm-order-history-rec">
            <div class="deliver-right-inner">
              <h3 class="order-history-dm">{{ _t('Order History') }}</h3>
              <div class="order-table">
                <table class="table table-responsive">
                  <thead>
                    <tr>
                      <th style="width:150px">{{ _t('Status') }}</th>
                      <th style="width:200px">{{ _t('Staff') }}</th>
                      <th style="width:500px">{{ _t('Time') }}</th>
                    </tr>
                  </thead>
                  <tbody
                    id="orderHistory"
                    v-if="selectedOrder.modifyOrder != 0"
                  >
                    <tr>
                      <td>New</td>
                      <td>{{ selectedOrder.created_by }}</td>
                      <td>
                        {{ selectedOrder.created_date }} /
                        {{ selectedOrder.created_time }}
                      </td>
                    </tr>
                    <tr
                      v-for="(mod, index) in selectedOrder.modifyOrder"
                      :key="index"
                    >
                      <td>{{ mod.reprinted != 1 ? 'Modified' : 'Reprint' }}</td>
                      <td>{{ mod.updated_by }}</td>
                      <td>{{ mod.updated_date }} / {{ mod.updated_time }}</td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td>New</td>
                      <td>{{ selectedOrder.created_by }}</td>
                      <td>
                        {{ selectedOrder.created_date }} /
                        {{ selectedOrder.created_time }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 class="order-history-dm">
                {{ _t('Order Modified History') }}
              </h3>
              <div class="order-table">
                <table class="table table-responsive">
                  <thead>
                    <tr>
                      <th style="width:150px">{{ _t('Modified Item') }}</th>
                      <th style="width:150px">{{ _t('What Modified?') }}</th>
                      <th style="width:150px">{{ _t('Who Modified?') }}</th>
                      <th style="width:150px">{{ _t('Time') }}</th>
                      <th style="width:150px">{{ _t('Modified Reason') }}</th>
                    </tr>
                  </thead>
                  <tbody v-if="selectedOrder.orderItemModifyArr.length">
                    <tr
                      v-for="(mod, index) in selectedOrder.orderItemModifyArr"
                      :key="index"
                    >
                      <td>{{ mod.item_name }}</td>
                      <td>{{ mod.message }}</td>
                      <td>{{ mod.updated_by }}</td>
                      <td>{{ mod.updated_date }} / {{ mod.updated_time }}</td>
                      <td>{{ mod.modify_reason_value }}</td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="5">{{ _t('Order not modified yet') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- End Dm popup histry -->
        </div>

        <div class="modal-footer">
          <div class="referal print-btn">
            <button
              type="button"
              data-value=""
              id="referal-btn"
              class="btn referal-btn dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {{ _t('Re-Print') }}
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" role="button" @click="generateInvoice">{{
                _t('Default')
              }}</a>
            </div>
            <!--<div class="referal">
              <button
                type="button"
                class="btn view-history"
                id="view-past-order"
              >
                View Past Orders
              </button>
              <button
                class="btn btn-success btn-large"
                type="button"
                id="dm-modify-btn"
              >
                <span><img src="img/other/edit-icon.png" alt="schedule"/></span
                >Modify
              </button>
            </div>-->
          </div>
          <div class="btn-announce">
            <button
              type="button"
              class="btn displayBlock"
              id="status-history"
              @click="toggleHistory()"
            >
              <span><img src="img/other/status.png" alt="status"/></span
              >{{ _t('Status History') }}
            </button>
            <button
              type="button"
              class="btn"
              id="recipt-history"
              @click="toggleHistory()"
            >
              <span><img src="img/other/reciept.png" alt="status"/></span>Show
              Receipt
            </button>
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>✕</span> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters, mapActions } from 'vuex'
//import InvoiceReprint from '@/components/deliveryManager/partial/InvoiceReprint'

export default {
  name: 'DMOrderDetails',
  computed: {
    ...mapState({
      selectedOrder: state => state.deliveryManager.selectedOrder,
    }),
    ...mapState({
      locationName: state => state.location.locationName,
    }),
    ...mapGetters('location', ['formatPrice']),
  },
  components: {
    //InvoiceReprint,
  },
  methods: {
    returnedAmount: function(paymentMode, amountChanged) {
      return paymentMode == 'Cash' ? amountChanged : 0
    },
    collectedAmount: function(payment) {
      return payment.payment_mode == 'Cash' ? payment.payment_amount : 0
    },
    toggleHistory: function() {
      $('#dm-order-confirmation').toggle()
      $('#dm-order-history-rec').toggle()
      $('#status-history').toggle()
      $('#recipt-history').toggle()
    },

    ...mapActions('checkout', ['generateInvoice']),
  },
}
</script>

<style scoped>
.displayBlock {
  display: inline-block;
}
</style>
