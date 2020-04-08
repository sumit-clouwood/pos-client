<template>
  <div class="modal fade" id="past-order" role="dialog" v-if="getOrderDetails">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->

      <div class="modal-content color-dashboard-background">
        <div class="modal-body order-confirmation-wrap">
          <div class="past-order-details-wrap">
            <div class="sidebar-past-order">
              <h4 class="color-text-invert">Placed By</h4>

              <p class="color-text">
                {{ getOrderDetails.customer.customer_name }}
              </p>
            </div>
            <div class="sidebar-past-order">
              <h4 class="color-text-invert">Order Date & Time</h4>
              <p class="color-text">{{ getOrderDetails.order_created }}</p>
            </div>
            <div class="sidebar-past-order">
              <h4 class="color-text-invert">Order Time</h4>
              {{ humanDateTime(getOrderDetails) }}
              <p class="color-text" :id="'od' + getOrderDetails.order_no"></p>
            </div>
            <div class="sidebar-past-order">
              <h4 class="color-text-invert">Driver</h4>
              <p class="color-text">Not Assigned</p>
            </div>
          </div>
          <div class="past-order-confirmation">
            <h1 class="order-id">Order {{ getOrderDetails.order_no }}</h1>
            <div class="order-table">
              <table class="table table-responsive">
                <tr class="color-secondary">
                  <th style="width: 300px" class="color-text-invert">
                    ITEM NAME
                  </th>
                  <th style="width: 100px" class="color-text-invert">QTY</th>
                  <th style="width: 150px" class="color-text-invert">PRICE</th>
                  <th style="width: 100px" class="color-text-invert">TAX</th>
                  <th style="width: 150px" class="color-text-invert">
                    SUBTOTAL
                  </th>
                </tr>
                <tr
                  v-for="item in getOrderDetails.items"
                  :key="item.item_id"
                  class="color-tables-background color-text"
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
