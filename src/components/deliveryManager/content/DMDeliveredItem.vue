<template>
    <div class="dm-ready-order-wrapper" id="dm-delivered">
        <div class="all-driver-main-div">
            <div class="clearfix all-driver-dropdown">
                <div class="select-driver">
                    <button
                            type="button"
                            class="btn dropdown-toggle"
                            data-toggle="dropdown"
                    >
                        Select Driver
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="(driver, index) in driverList" :key="index">
                            <!--<img
                                    :src="driver.driverImagePath"
                                    class="pull-left driverImg"
                                    @error="imageLoadError()"
                            />-->
                            <a href="#" @click="selectedDriver(driver)">{{ driver.name }}</a>
                        </li>
                    </ul>
                    <!-- <p>Show Available Drivers</p> -->

                </div>
                <div class="average-time">
                    <p class="lead">Average Delivery Time: <span id="avg_time" v-if="orderDetails.averageDeliveryTime">{{ orderDetails.averageDeliveryTime }} </span></p>
                    <p class="lead total-order-sum">Total: <span id="total"> {{ formatPrice(orderDetails.orderTota)  }}</span></p>
            </div>
            </div>
        </div>
        <!--Order details -->
        <div class="delivered-order-table">
            <table class="table table-responsive">
                <tbody>
                <tr>
                    <th style="width: 260px">DRIVER NAME</th>
                    <th style="width: 150px">TOTAL DELIVERED</th>
                    <th style="width: 190px">TOTAL AMOUNT</th>
                    <th style="width: 255px">CASH AMOUNT</th>
                    <th style="width: 190px">CREDIT AMOUNT</th>
                    <th style="width: 190px">AVERAGE DELIVERY TIME</th>
                    <th style="width: 250px"></th>
                </tr>
                <tr class="" v-for="(order, index) in orderDetails.driverPerformanceList " :key="index">
                    <td>{{ order.driverName }}</td>
                    <td>{{ order.noOfOrders }}</td>
                    <td>{{ order.orderSum }}</td>
                    <td>{{ order.cash }}</td>
                    <td>{{ order.credit }}</td>
                    <td>{{ order.averageDeliveryTime }}</td>

                    <td class="show-details-his">
                        <span class="show-details" @click="getMoreDeliveredOrder(order.driverDetails)">
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
                            </g></svg>
                            <span @click="showMoreOrders(order.driverId)">Show Details</span>
                        </span>
                        <!--<small class="delivered-refresh-data">
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 16 16"
                                    version="1.1"
                                    width="16px"
                                    height="16px"
                            >
                                <g id="surface1">
                                    <path
                                            style=" "
                                            d="M 7.5 1.035156 C 3.917969 1.035156 1 3.941406 1 7.515625 L 1 8 L 2 8 L 2 7.515625 C 2 4.484375 4.457031 2.035156 7.5 2.035156 C 9.132813 2.035156 10.589844 2.75 11.59375 3.875 L 10.464844 5 L 14 5 L 14 1.476563 L 12.300781 3.167969 C 11.113281 1.863281 9.40625 1.035156 7.5 1.035156 Z M 13 7 L 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 5.859375 13 4.402344 12.277344 3.394531 11.140625 L 4.535156 10 L 1 10 L 1 13.535156 L 2.6875 11.847656 C 3.878906 13.164063 5.589844 14 7.5 14 C 11.085938 14 14 11.085938 14 7.5 L 14 7 Z "
                                    />
                                </g>
                            </svg>
                            <span>Refresh Data</span>
                        </small>-->
                        <span class="delivered-hide">
                            <span> Hide </span>
                            <img src="img/other/hide.png" alt="hide"/>
                        </span>
                    </td>
                </tr>
                <ShowDeliveredOrderDetails :orders="orderMoreDetails"/>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
/*  global $  */

import { mapState, mapActions, mapGetters } from 'vuex'
import ShowDeliveredOrderDetails from '@/components/deliveryManager/content/ShowDeliveredOrderDetails'
export default {
  name: 'DMDeliveredItem',
  data() {
    return {
      orderMoreDetails: false
    }
  },
  computed: {
    ...mapState({
      orderDetails: state => state.deliveryManager.orders,
    }),
    ...mapState({
      driverList: state => state.location.locationData.drivers,
    }),
    ...mapGetters('location', ['formatPrice']),

  },
  components: {
    ShowDeliveredOrderDetails
  },
  methods: {
    selectedDriver: function(driver) {
      this.waitingOrder.action = driver.name
      this.waitingOrder.driverId = driver._id
      this.selectDriver(driver)
    },
    getMoreDeliveredOrder: function (orderDetails) {
      this.orderMoreDetails = orderDetails
    },
    ...mapActions('deliveryManager', ['selectDriver']),
    ...mapActions('deliveryManager', ['showMoreOrders']),
  },
  updated() {
    $('.delivered-order-table .show-details-his > span').click(function () {
      $('.delivered-order-table .show-details-his > span').removeClass('active')
      $('.delivered-order-table table tr').removeClass('active')

      $(this).parent().addClass('active')
      $(this).parents('tr').addClass('active')
      $(this).closest('.show-details').show()
      $(this).hide()
      $('.delivered-data').show().insertAfter('.delivered-order-table .table tr.active')
    })

    $('span.delivered-hide').click(function (e) {
      e.stopPropagation()
      $(this).closest('.delivered-hide').show()
      $(this).hide()
      $(this).parent().addClass('active')
      $(this).parents('tr').next('tr#delivered-data').remove()
      $(this).parent('.show-details-his').removeClass('active')
      /*$('.delivered-order-table tr#delivered-data').remove();*/
    })

    $('button.dm-btn, .all-tables-wrap > button').click(function () {
      $('button.dm-btn, .all-tables-wrap > button').removeClass('active')
      $(this).addClass('active')
    })
  }
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

span.delivered-hide {margin-top:5px; margin-left:0 !important;}

/*small.delivered-hide > span {display:none;}

.delivered-order-table td.show-details-his > span > span {display:block;}

.delivered-order-table td.show-details-his > span {margin-right:0; padding-right:0;}

small.delivered-refresh-data > span {display:none;}*/

.average-time {
    padding-left: 10px;
}
.show-details {
    display:block;
}
.delivered-hide{
    display:none;
}
/* */
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
.deliverd-time-table_header p,.delivered-data-wrapper p {
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
.delivery-avg-delivery-time{
    height: 109px;
}
.delivered-data-wrapper > .table p {
    letter-spacing: 0.4px;
    color: #a4a4a4;
    font-size: 12px !important;
    text-transform: uppercase;
}
.table {
    padding: .75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
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
    border-radius:4px;
    background-color:#f35c7f;
    display:inline-block;
    padding:2px 5px;
    color:#fff;
    font-size:12px;
    border-top-right-radius:0;
    border-bottom-right-radius:0;
    float:left;
}
span.delivery-pickup {
    background-color:#7881d5;
    padding:2px 5px;
    color:#fff;
    font-weight:600;
    font-size:12px;
    /* border-radius: 4px; */
    display:inline-block;
    float:left;
}
span.delivery-delivered {
    border-radius:4px;
    background-color:#47cd8f;
    font-size:12px;
    font-weight:600;
    display:inline-block;
    padding:2px 5px;
    color:#fff;
    border-top-left-radius:0;
    border-bottom-left-radius:0;
    float:left;
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
