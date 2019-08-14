<template>
  <div>
    <div class="historyMainContainer show-table-delivered">
      <table class="table">
        <thead>
          <tr>
            <th><i class="fa fa-file"></i> {{ _t('Order Number') }}</th>
            <th><i class="fa fa-asterisk"></i> {{ _t('Amount') }}</th>
            <th style="width: 650px;">
              <i class="fa fa-road"></i>
              {{ _t('Order Performance (Preparation | Pickup | Delivery)') }}
            </th>
            <th style="width: 200px;">
              <i class="fa fa-clock-o"></i> {{ _t('Total Time') }}
            </th>
            <th><i class="fa fa-tag"></i> {{ _t('Status') }}</th>
          </tr>
        </thead>
        <tbody v-if="currentDriverOrders.orders">
          <tr v-for="(order, key) in currentDriverOrders.orders" :key="key">
            <td class="showOrderContentsButton dashboardStyleLink">
              <span
                @click="selectedOrderDetails(order._id)"
                class="open-details-popup cursor-pointer"
                data-dismiss="modal"
                data-target=".bd-example-modal-lg"
                data-toggle="modal"
              >
                <a role="button">#{{ order.order_no }}</a>
              </span>
            </td>
            <td>{{ formatPrice(order.balance_due) }}</td>
            <td class="perfTD">
              <div class="perfContainer perfContainer-span">
                <span class="perfContent prepData prepDataDelivered"
                  >{{
                    timeDiff(order.deliveryPlacedTime, order.deliveryReadyTime)
                  }}
                  Prep.</span
                >
                <span class="perfContent pickData pickDataDelivered"
                  >{{
                    timeDiff(order.deliveryReadyTime, order.deliveryStartTime)
                  }}Pick</span
                >
                <span class="perfContent deliData deliDataDelivered"
                  >{{
                    timeDiff(order.deliveryStartTime, order.deliveryEndTime)
                  }}
                  {{ _t('Delivery') }}</span
                >
                <br clear="all" />
              </div>
            </td>
            <td class="">
              <div class="delManTime">
                {{ timeDiff(order.deliveryPlacedTime, order.deliveryEndTime) }}
              </div>
            </td>
            <td>
              <span
                class="label label-success label-block delManLabelStat Delivered text-center delivered-green-btn"
                >{{ _t('Delivered') }}</span
              >
            </td>
          </tr>
        </tbody>
      </table>

      <div class="driverSummary" v-if="currentDriverOrders.orders">
        <div class="row-fluid">
          <div class="span3 span-driver-one">
            <span class="span-text-one">{{ _t('Total Deliveries') }}:</span>
            <br /><span class="driverSummaryTotal totalDelivery">{{
              currentDriverOrders.orders.length
            }}</span>
          </div>
          <div class="span3">
            <span class="span-text-two">Total:</span> <br />
            <span class="driverSummaryTotal">
              {{ formatPrice(currentDriverOrders.totalAmount) }}
            </span>
          </div>
          <div class="span3 span-driver-three">
            <span class="span-text-three"
              >{{ _t('Average Delivery Time') }}:
            </span>
            <br /><span class="driverSummaryTotal">{{
              avgTime(currentDriverOrders)
            }}</span>
          </div>
          <!-- <div class="span3">Average Time: <br><span class="driverSummaryTotal">Static minutes</span></div> -->
        </div>
      </div>
      <div class="driverSummary">
        <table></table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ShowDeliveredOrderDetails',
  computed: {
    ...mapGetters('deliveryManager', [
      'currentDriverOrders',
      'avgTime',
      'timeDiff',
    ]),
    ...mapGetters('location', ['formatPrice', '_t']),
  },
  methods: {
    ...mapActions('order', ['selectedOrderDetails']),
  },
}
</script>

<style scoped>
/* */
.delivered-btn > span {
  border-radius: 6px;
  background-color: #47cd8f;
  display: inline-block;
  padding: 8px 10px;
  color: #fff;
  font-size: 14px;
  text-transform: capitalize;
}
.delivered-data-wrapper .table {
  background-color: #f7f8fa;
  border-radius: 8px;
}
.delivery-avg-delivery-time {
  background-color: #eef0f3;
}
.delivered-data-wrapper .table {
  background-color: #f7f8fa;
  border-radius: 8px;
}
.deliverd-time-table {
  height: 80px;
  vertical-align: middle;
}
.deliverd-time-table_header p,
.delivered-data-wrapper p {
  display: inline-block;
}
.delivered-data-wrapper > .table p {
  letter-spacing: 0.4px;
  color: #a4a4a4;
  font-size: 12px !important;
  text-transform: uppercase;
}
.delivered-data-wrapper > .table div p {
  letter-spacing: 0.4px;
  color: #a4a4a4;
  font-size: 12px !important;
  text-transform: uppercase;
}
.delivery-avg-delivery-time {
  height: 109px;
}
.delivered-data-wrapper > .table p {
  letter-spacing: 0.4px;
  color: #a4a4a4;
  font-size: 12px !important;
  text-transform: uppercase;
}
.table {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}
.deliverd-time-table_header {
  display: flex;
}
.delivery-avg-delivery-time p span {
  display: block;
  letter-spacing: 0.6px;
  color: #3a3d44;
  font-size: 20px;
  font-weight: 600;
}
.delivered-data-wrapper .table p.delivered-btn > span {
  border-radius: 6px;
  background-color: #47cd8f;
  display: inline-block;
  padding: 8px 10px;
  color: #fff;
  font-size: 14px;
  text-transform: capitalize;
}
.delivery-avg-delivery-time p {
  letter-spacing: 0.6px;
  color: #3a3d44 !important;
  font-size: 14px !important;
  font-weight: 600 !important;
}
.deliverd-time-table {
  /*display: flex;*/
  justify-content: space-between;
}
.delivery-avg-delivery-time {
  /*display: flex;*/
  justify-content: space-between;
}
span.delivery-preptn {
  border-radius: 4px;
  background-color: #f35c7f;
  display: inline-block;
  padding: 2px 5px;
  color: #fff;
  font-size: 12px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  float: left;
}
span.delivery-pickup {
  background-color: #7881d5;
  padding: 2px 5px;
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  /* border-radius: 4px; */
  display: inline-block;
  float: left;
}
span.delivery-delivered {
  border-radius: 4px;
  background-color: #47cd8f;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  padding: 2px 5px;
  color: #fff;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  float: left;
}
tr.delivery-avg-delivery-time td span {
  display: block;
  letter-spacing: 0.6px;
  color: #3a3d44;
  font-size: 20px;
  font-weight: 600;
}
tr.delivery-avg-delivery-time td {
  letter-spacing: 0.6px;
  color: #3a3d44 !important;
  font-size: 14px !important;
  font-weight: 600 !important;
}
tr.delivery-avg-delivery-time td {
  height: 109px;
  vertical-align: middle;
}
</style>
