<template>
  <div
    class="table-delivery table-responsive table-responsive-delivered-table "
  >
    <div class="all-driver-main-div">
      <div class="clearfix all-driver-dropdown">
        <div class="select-driver" v-if="driverList">
          <div>
            <button
              type="button"
              class="btn dropdown-toggle input-search-driver"
              data-toggle="dropdown"
            >
              {{ _t('Select Driver') }}
            </button>
            <ul class="dropdown-menu">
              <li v-for="(driver, index) in driverList" :key="index">
                <a href="javascript:void(0)" @click="selectedDriver(driver)">{{
                  driver.name
                }}</a>
              </li>
            </ul>
          </div>
          <div class="average-time">
            <p class="lead">
              {{ _t('Average Delivery Time') }}:
              <span id="avg_time" v-if="orderDetails.averageDeliveryTime"
                >{{ orderDetails.averageDeliveryTime }}
              </span>
            </p>
            <p class="lead total-order-sum">
              {{ _t('Total') }}:
              <span id="total">
                {{ formatPrice(orderDetails.orderTotal) }}</span
              >
            </p>
          </div>
          <!-- <p>Show Available Drivers</p> -->
        </div>
      </div>
    </div>
    <table class="table">
      <thead class="muted">
        <tr>
          <th>{{ _t('DRIVER NAME') }}</th>
          <th>{{ _t('TOTAL DELIVERED') }}</th>
          <th>{{ _t('TOTAL AMOUNT') }}</th>
          <th>{{ _t('CASH AMOUNT') }}</th>
          <th>{{ _t('CREDIT AMOUNT') }}</th>
          <th>{{ _t('AMOUNT TO COLLECT') }}</th>
          <th>{{ _t('AVERAGE DELIVERY TIME') }}</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr class="dataContentStyle" v-for="order in orders" :key="order._id">
          <td class="driverNameContainer showMore">
            {{ order.driver }}
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
              ><i class="fa fa-refresh fa"></i> {{ _t('Collect Money') }}</a
            >
            &nbsp;
            <a
              id="refresh_data-5bccbd789e1dba5c01539343"
              href=""
              class="btn btn-success btn-large btnRefreshDetails btn-data-refresh"
              style="display: none;"
              ><i class="fa fa-refresh fa"></i> {{ _t('Refresh Data') }}</a
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
                  <g fill="#fff" fill-rule="nonzero">
                    <path
                      d="M10 12.971c-2.229 0-4.621-1.053-6.921-3.063A19.21 19.21 0 0 1 .263 6.884a.526.526 0 0 1 0-.608A19.21 19.21 0 0 1 3.08 3.25C5.379 1.245 7.77.187 10 .187s4.621 1.052 6.921 3.063a19.21 19.21 0 0 1 2.816 3.024.526.526 0 0 1 0 .608 19.21 19.21 0 0 1-2.816 3.026c-2.3 2.005-4.692 3.063-6.921 3.063zM1.363 6.58c.924 1.174 4.492 5.34 8.637 5.34 4.145 0 7.716-4.164 8.637-5.34-.924-1.174-4.492-5.34-8.637-5.34-4.145 0-7.716 4.164-8.637 5.34z"
                    ></path>
                    <path
                      d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"
                    ></path>
                  </g>
                </svg>
              </span>
              {{ _t('Show Details') }}</a
            >
            <a
              id="driver_details_hide-5bccbd789e1dba5c01539343"
              href="javascript:;"
              class="btn btn-info btn-large btnShowDetails btn-show-details"
              style="display: none;"
              >{{ _t('Hide') }}</a
            >
          </td>
        </tr>
        <ShowDeliveredOrderDetails />
      </tbody>
    </table>
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
<style scoped lang="css">
.select-driver {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
}
.all-driver-dropdown{
    width: 30%;
    padding-bottom: 21px;
}
.average-time {
    letter-spacing: 0.4px;
    color: #a4a4a4;
    font-size: 10px;
    font-weight: normal;
}
</style>
