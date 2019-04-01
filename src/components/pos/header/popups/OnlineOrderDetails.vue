<template>
  <div class="modal fade" id="past-order" role="dialog" v-if="getOrderDetails">
    <div class="modal-dialog">
      <!-- Modal content-->

      <div class="modal-content">
        <div class="modal-body order-confirmation-wrap">
          <div class="past-order-details-wrap">
            <div class="sidebar-past-order">
              <h4>Placed By</h4>

              <p>{{ getOrderDetails.customer.customer_name }}</p>
            </div>
            <div class="sidebar-past-order">
              <h4>Order Date & Time</h4>
              <p>{{ getOrderDetails.order_created }}</p>
            </div>
            <div class="sidebar-past-order">
              <h4>Order Time</h4>
              {{ humanDateTime(getOrderDetails) }}
              <p :id="'od' + getOrderDetails.order_no"></p>
            </div>
            <div class="sidebar-past-order">
              <h4>Driver</h4>
              <p>Not Assigned</p>
            </div>
          </div>
          <div class="past-order-confirmation">
            <h1 class="order-id">Order {{ getOrderDetails.order_no }}</h1>
            <div class="order-table">
              <table class="table table-responsive">
                <tr>
                  <th style="width: 300px">ITEM NAME</th>
                  <th style="width: 100px">QTY</th>
                  <th style="width: 150px">PRICE</th>
                  <th style="width: 100px">TAX</th>
                  <th style="width: 150px">SUBTOTAL</th>
                </tr>
                <tr v-for="(item, index) in getOrderDetails.items" :key="index">
                  <td>
                    {{ item.item_name }}
                    <div class="head1" v-if="item.item_modifiers.length">
                      <i
                        class="fa fa-leaf categoryColorContainer green-txt"
                      ></i>
                    </div>
                    <div v-if="item.item_modifiers.length" class="online-order-details-wrap">
                        <div
                          v-for="(modifier, key) in item.item_modifiers"
                          :key="key"
                        >
                                  <p
                                    class="ng-binding"
                                    v-for="(PMDetails,
                                    index) in modifier.modifiers.price_modifiers"
                                    :key="index"
                                  >
                                    {{ PMDetails.item_name }} ({{ PMDetails.location_price}})
                                  </p>
                                    <p
                                            class="ng-binding"
                                            v-for="(MMDetails,
                                    index) in modifier.modifiers.mandatory_modifiers"
                                            :key="index"
                                    >
                                        {{ MMDetails.item_name }}
                                    </p>
                                  <p
                                    class="ng-binding"
                                    v-for="(RMDetails,
                                    index) in modifier.modifiers.regular_modifiers"
                                    :key="index"
                                  >
                                    {{ RMDetails.item_name }}
                                  </p>
                        </div>
                    </div>
                  </td>
                  <td>{{ item.item_quantity }}</td>
                  <td>{{ item.item_price_each }}</td>
                  <td>{{ item.item_tax }}</td>
                  <td>{{ item.item_price_total }}</td>
                </tr>
              </table>
            </div>
            <div id="total-order-past-wrap" class="total-order">
              <div class="order-confirm-amt" id="past-confirm-order">
                <div class="order-amt-title">
                  <p>SUBTOTAL :</p>
                  <p>SURCHARGE :</p>
                  <p>ORDER DISCOUNT :</p>
                  <p>TAX :</p>
                  <p>BILL AMOUNT :</p>
                </div>
                <div class="order-amt-charges">
                  <p>
                    {{ getOrderDetails.currency_code }}
                    {{ getOrderDetails.subtotal }}
                  </p>
                  <p>
                    {{ getOrderDetails.currency_code }}
                    {{ getOrderDetails.surcharge }}
                  </p>
                  <p>
                    {{ getOrderDetails.currency_code }}
                    {{ getOrderDetails.discount_amount }}
                  </p>
                  <p>
                    {{ getOrderDetails.currency_code }}
                    {{ getOrderDetails.final_tax }}
                  </p>
                  <p>
                    {{ getOrderDetails.currency_code }}
                    {{ getOrderDetails.balance_due }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="referal">
            <button type="button" class="btn view-history" id="view-history">
              View History
            </button>
            <button
              class="btn btn-success btn-large"
              type="button"
              id="modify-btn"
            >
              <span class="fa fa-edit"></span>Modify
            </button>
          </div>
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>X</span> Close
            </button>
            <button type="button" class="btn btn-danger cancel-announce">
              Cancel Order
            </button>
          </div>
          <!--<button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateTime from '@/mixins/DateTime'
import { mapState } from 'vuex'

export default {
  props: {},
  mixins: [DateTime],
  computed: {
    ...mapState({
      getOrderDetails: state => state.order.selectedOrder,
    }),
  },
}
</script>
