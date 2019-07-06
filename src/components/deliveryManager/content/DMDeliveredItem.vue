<template>
  <div
    class="table-delivery table-responsive table-responsive-delivered-table "
  >
    <table class="table">
      <thead class="muted">
        <tr>
          <th>DRIVER NAME</th>
          <th>TOTAL DELIVERED</th>
          <th>TOTAL AMOUNT</th>
          <th>CASH AMOUNT</th>
          <th>CREDIT AMOUNT</th>
          <th>AMOUNT TO COLLECT</th>
          <th>AVERAGE DELIVERY TIME</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr class="dataContentStyle">
          <td class="driverNameContainer showMore">
            Ubaid Khalifa B driver
          </td>
          <td>4</td>
          <td>271.98</td>
          <td>271.98</td>
          <td>0</td>
          <td id="driverInHandAmount">271.98</td>
          <td>00:00:05</td>
          <td class="align-right">
            <a
              id="open-collect-money-modal"
              href="javascript:void(0)"
              class="btn btn-success btn-large collect-driver-money-btn"
              driver-id="5bccbd789e1dba5c01539343"
              total-orders="4"
              cash="271.98"
              ><i class="fa fa-refresh fa"></i>Collect Money</a
            >
            &nbsp;
            <a
              id="refresh_data-5bccbd789e1dba5c01539343"
              href=""
              class="btn btn-success btn-large btnRefreshDetails btn-data-refresh"
              style="display: none;"
              ><i class="fa fa-refresh fa"></i>&nbsp;Refresh Data</a
            >&nbsp;
            <a
              id="driver_details-5bccbd789e1dba5c01539343"
              href="javascript:;"
              class="btn btn-info btn-large btnShowDetails btn-show-details-delivered"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="13"
                  viewBox="0 0 20 13"
                >
                  <g fill="#27A83D" fill-rule="nonzero">
                    <path
                      d="M10 12.971c-2.229 0-4.621-1.053-6.921-3.063A19.21 19.21 0 0 1 .263 6.884a.526.526 0 0 1 0-.608A19.21 19.21 0 0 1 3.08 3.25C5.379 1.245 7.77.187 10 .187s4.621 1.052 6.921 3.063a19.21 19.21 0 0 1 2.816 3.024.526.526 0 0 1 0 .608 19.21 19.21 0 0 1-2.816 3.026c-2.3 2.005-4.692 3.063-6.921 3.063zM1.363 6.58c.924 1.174 4.492 5.34 8.637 5.34 4.145 0 7.716-4.164 8.637-5.34-.924-1.174-4.492-5.34-8.637-5.34-4.145 0-7.716 4.164-8.637 5.34z"
                    ></path>
                    <path
                      d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"
                    ></path>
                  </g>
                </svg>
              </span>
              &nbsp;Show Details</a
            >
            <a
              id="driver_details_hide-5bccbd789e1dba5c01539343"
              href="javascript:;"
              class="btn btn-info btn-large btnShowDetails btn-show-details"
              style="display: none;"
              >Hide</a
            >
          </td>
        </tr>
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
                        <i class="fa fa-road"></i> Order Performance
                        (Preparation | Pickup | Delivery)
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
                      <br /><span class="driverSummaryTotal totalDelivery"
                        >4</span
                      >
                    </div>
                    <div class="span3">
                      <span class="span-text-two">Total:</span> <br />
                      <span class="driverSummaryTotal">
                        271.98 AED
                      </span>
                    </div>
                    <div class="span3 span-driver-three">
                      <span class="span-text-three"
                        >Average Delivery Time:
                      </span>
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
      </tbody>
    </table>
  </div>
</template>

<script>
/*  global $  */

import { mapState, mapActions, mapGetters } from 'vuex'
// import ShowDeliveredOrderDetails from '@/components/deliveryManager/content/ShowDeliveredOrderDetails'
export default {
  name: 'DMDeliveredItem',
  computed: {
    ...mapState({
      orderDetails: state => state.deliveryManager.orders,
    }),
    ...mapState({
      driverList: state => state.deliveryManager.drivers,
    }),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('deliveryManager', ['orders']),
  },
  data() {
    return {
      updateId: String,
    }
  },
  components: {
    // ShowDeliveredOrderDetails,
  },
  methods: {
    selectedDriver: function(driver) {
      this.waitingOrder.action = driver.name
      this.waitingOrder.driverId = driver._id
      this.selectDriver(driver)
    },
    showMoreDetails: function(driverId) {
      this.showMoreOrders(driverId)
      this.toggleMe(driverId)
    },
    toggleMe: function(Id) {
      this.updateId = Id
    },
    ...mapActions('deliveryManager', ['selectDriver']),
    ...mapActions('deliveryManager', ['showMoreOrders']),
  },
  updated() {
    let dataElement = this
    $('.delivered-order-table .show-details-his > span').click(function() {
      $('.delivered-order-table .show-details-his > span').removeClass('active')
      $('.delivered-order-table table tr').removeClass('active')

      $(this)
        .parent()
        .addClass('active')
      $(this)
        .parents('tr')
        .addClass('active')
      $('.show-details').show()
      $('.delivered-hide').hide()
      $('#show' + dataElement.updateId).hide()
      $('#hide' + dataElement.updateId).show()
      $('.delivered-data').insertAfter(
        '.delivered-order-table .table tr.active'
      )
      $('.delivered-data').show()
    })

    $('span.delivered-hide').click(function(e) {
      e.stopPropagation()
      $(this)
        .parent()
        .addClass('active')
      $('.delivered-data').hide()
      $(this)
        .parents('tr')
        .removeClass('active')
      $('#show' + dataElement.updateId).show()
      $('#hide' + dataElement.updateId).hide()
    })

    $('button.dm-btn, .all-tables-wrap > button').click(function() {
      $('button.dm-btn, .all-tables-wrap > button').removeClass('active')
      $(this).addClass('active')
    })
  },
}
</script>

<style scoped>
.all-driver-dropdown > div {
  display: inline-block;
  vertical-align: middle;
}

.average-time > p {
  margin-bottom: 0;
  font-size: 14px;
  letter-spacing: 0.6px;
  color: #3d3f43;
}

span.delivered-hide {
  margin-top: 5px;
  margin-left: 0 !important;
}

.average-time {
  padding-left: 10px;
}
.show-details {
  display: block;
  width: 130px;
}
.delivered-hide {
  display: none;
}
</style>
