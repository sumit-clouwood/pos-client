<template>
  <tr
    id="order_details_div-5bccbd789e1dba5c01539343"
    class="OrderDetailscontainer_13126 detContainer"
    style="display: none;"
  >
    <td colspan="12" class="OrderDetails_13126 detailsContainerStyle">
      <div>
        <div class="historyMainContainer show-table-delivered">
          <table class="table">
            <thead>
              <tr>
                <th><i class="fa fa-file"></i> Order Number</th>
                <th><i class="fa fa-asterisk"></i> Amount</th>
                <th style="width: 650px;">
                  <i class="fa fa-road"></i> Order Performance (Preparation |
                  Pickup | Delivery)
                </th>
                <th style="width: 200px;">
                  <i class="fa fa-clock-o"></i> Total Time
                </th>
                <th><i class="fa fa-tag"></i> Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  class="showOrderContentsButton dashboardStyleLink"
                  ng-click="getOrderDetail('5d1f3be31e1c405a066421e4')"
                >
                  <span id="5d1f3be31e1c405a066421e4">3946396 </span>
                </td>
                <td>28.99 AED</td>
                <td class="perfTD">
                  <div class="perfContainer perfContainer-span">
                    <span class="perfContent prepData prepDataDelivered"
                      >16 Hours 39 Minutes 36 Seconds Prep.</span
                    >
                    <span class="perfContent pickData pickDataDelivered"
                      >08 Seconds Pick</span
                    >
                    <span class="perfContent deliData deliDataDelivered"
                      >07 Seconds Delivery</span
                    >
                    <br clear="all" />
                  </div>
                </td>
                <td class="">
                  <div class="delManTime">
                    16 Hours 39 Minutes 51 Seconds
                  </div>
                </td>
                <td>
                  <span
                    class="label label-success label-block delManLabelStat Delivered text-center delivered-green-btn"
                    >Delivered</span
                  >
                </td>
              </tr>

              <tr>
                <td
                  class="showOrderContentsButton dashboardStyleLink"
                  ng-click="getOrderDetail('5d1f3501e30b892dd068f348')"
                >
                  <span id="5d1f3501e30b892dd068f348">3946240 </span>
                </td>
                <td>122.50 AED</td>
                <td class="perfTD">
                  <div class="perfContainer perfContainer-span">
                    <span class="perfContent prepData prepDataDelivered"
                      >17 Hours 09 Minutes Prep.</span
                    >
                    <span class="perfContent pickData pickDataDelivered"
                      >08 Seconds Pick</span
                    >
                    <span class="perfContent deliData deliDataDelivered"
                      >07 Seconds Delivery</span
                    >
                    <br clear="all" />
                  </div>
                </td>
                <td class="">
                  <div class="delManTime">
                    17 Hours 09 Minutes 15 Seconds
                  </div>
                </td>
                <td>
                  <span
                    class="label label-success label-block delManLabelStat Delivered text-center delivered-green-btn"
                    >Delivered</span
                  >
                </td>
              </tr>

              <tr>
                <td
                  class="showOrderContentsButton dashboardStyleLink"
                  ng-click="getOrderDetail('5d1f52a39660a83026045409')"
                >
                  <span id="5d1f52a39660a83026045409">3946794 </span>
                </td>
                <td>66.99 AED</td>
                <td class="perfTD">
                  <div class="perfContainer perfContainer-span">
                    <span class="perfContent prepData prepDataDelivered"
                      >16 Hours 05 Minutes 04 Seconds Prep.</span
                    >
                    <span class="perfContent pickData pickDataDelivered"
                      >04 Seconds Pick</span
                    >
                    <span class="perfContent deliData deliDataDelivered"
                      >04 Seconds Delivery</span
                    >
                    <br clear="all" />
                  </div>
                </td>
                <td class="">
                  <div class="delManTime">
                    16 Hours 05 Minutes 12 Seconds
                  </div>
                </td>
                <td>
                  <span
                    class="label label-success label-block delManLabelStat Delivered text-center delivered-green-btn"
                    >Delivered</span
                  >
                </td>
              </tr>

              <tr>
                <td
                  class="showOrderContentsButton dashboardStyleLink"
                  ng-click="getOrderDetail('5d1f918be30b892a29076862')"
                >
                  <span id="5d1f918be30b892a29076862">3948698 </span>
                </td>
                <td>53.50 AED</td>
                <td class="perfTD">
                  <div class="perfContainer perfContainer-span">
                    <span class="perfContent prepData prepDataDelivered"
                      >16 Hours 03 Minutes 41 Seconds Prep.</span
                    >
                    <span class="perfContent pickData pickDataDelivered"
                      >06 Seconds Pick</span
                    >
                    <span class="perfContent deliData deliDataDelivered"
                      >05 Seconds Delivery</span
                    >
                    <br clear="all" />
                  </div>
                </td>
                <td class="">
                  <div class="delManTime">
                    16 Hours 03 Minutes 52 Seconds
                  </div>
                </td>
                <td>
                  <span
                    class="label label-success label-block delManLabelStat Delivered text-center delivered-green-btn"
                    >Delivered</span
                  >
                </td>
              </tr>
            </tbody>
          </table>

          <div class="driverSummary">
            <div class="row-fluid">
              <div class="span3 span-driver-one">
                <span class="span-text-one">Total Deliveries:</span>
                <br /><span class="driverSummaryTotal totalDelivery">4</span>
              </div>
              <div class="span3">
                <span class="span-text-two">Total:</span> <br />
                <span class="driverSummaryTotal">
                  271.98 AED
                </span>
              </div>
              <div class="span3 span-driver-three">
                <span class="span-text-three">Average Delivery Time: </span>
                <br /><span class="driverSummaryTotal">00:00:05</span>
              </div>
              <!-- <div class="span3">Average Time: <br><span class="driverSummaryTotal">Static minutes</span></div> -->
            </div>
          </div>
          <div class="driverSummary">
            <table></table>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ShowDeliveredOrderDetails',
  computed: {
    /*...mapState({
      orders: state => state.deliveryManager.moreOrders,
    }),*/
    ...mapGetters('deliveryManager', ['orders']),
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
