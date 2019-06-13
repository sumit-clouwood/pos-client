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
              <a href="javascript:void(0)" @click="selectedDriver(driver)">{{
                driver.name
              }}</a>
            </li>
          </ul>
          <!-- <p>Show Available Drivers</p> -->
        </div>
        <div class="average-time">
          <p class="lead">
            Average Delivery Time:
            <span id="avg_time" v-if="orderDetails.averageDeliveryTime"
              >{{ orderDetails.averageDeliveryTime }}
            </span>
          </p>
          <p class="lead total-order-sum">
            Total:
            <span id="total"> {{ formatPrice(orderDetails.orderTotal) }}</span>
          </p>
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
          <tr
            class=""
            v-for="(order, index) in orderDetails.driverPerformanceList"
            :key="index"
          >
            <td>{{ order.driverName }}</td>
            <td>{{ order.noOfOrders }}</td>
            <td>{{ order.orderSum }}</td>
            <td>{{ order.cash }}</td>
            <td>{{ order.credit }}</td>
            <td>{{ order.averageDeliveryTime }}</td>

            <td class="show-details-his">
              <span
                class="show-details"
                @click="showMoreDetails(order.driverId)"
                :id="'show' + order.driverId"
              >
                <i class="fa fa-eye"></i>
                <span> Show Details </span>
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
              <span
                class="delivered-hide"
                @click="toggleMe(order.driverId)"
                :id="'hide' + order.driverId"
              >
                <i class="fa fa-eye-slash"></i>
                <span> Hide </span>
              </span>
            </td>
          </tr>
          <ShowDeliveredOrderDetails />
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
  computed: {
    ...mapState({
      orderDetails: state => state.deliveryManager.orders,
    }),
    ...mapState({
      driverList: state => state.location.locationData.drivers,
    }),
    ...mapGetters('location', ['formatPrice']),
  },
  data() {
    return {
      updateId: String,
    }
  },
  components: {
    ShowDeliveredOrderDetails,
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
