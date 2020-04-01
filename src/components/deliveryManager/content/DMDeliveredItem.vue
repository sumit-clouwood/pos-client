<template>
  <div class="table-delivery table-responsive table-responsive-delivered-table">
    <div class="all-driver-main-div">
      <div class="clearfix all-driver-dropdown">
        <div class="select-driver" v-if="drivers">
          <div class="delivered-driver">
            <div class="select-driver">
              <div v-if="drivers" class="driver-container">
                <form>
                  <input
                    autocomplete="off"
                    type="text"
                    placeholder="Select Driver"
                    class="input-search-driver"
                    id="get-customer-list"
                    v-model="selectedDriver"
                    @click="showDropdown"
                  />
                </form>
                <div id="my-dropdown" class="dropdown-content cursor-pointer">
                  <span class="dropdown" :key="0" @click="setDriver(null)">{{
                    _t('Select Driver')
                  }}</span>
                  <span
                    class="dropdown"
                    v-for="dri in drivers"
                    :key="dri._id"
                    @click="setDriver(dri)"
                    >{{ dri.name }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="average-time">
            <p class="lead">
              {{ _t('Average Delivery Time') }}:
              <span id="avg_time" v-if="driverOrders">{{
                averageDeliveryTime().time
              }}</span>
            </p>
            <p class="lead total-order-sum">
              {{ _t('Total') }}:
              <span id="total">{{
                formatPrice(averageDeliveryTime().amount)
              }}</span>
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
          <th style="width:235px">&nbsp;</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="(driOrders, deliveryDriver) in driverOrders">
          <tr class="dataContentStyle" :key="deliveryDriver">
            <td class="driverNameContainer showMore">{{ deliveryDriver }}</td>
            <td>{{ driOrders.orders.length }}</td>
            <td>{{ driOrders.amountToCollect.toFixed(2) }}</td>
            <td>{{ driOrders.cashPayment.toFixed(2) }}</td>
            <td>{{ driOrders.creditPayment.toFixed(2) }}</td>
            <td id="driverInHandAmount">
              {{ driOrders.totalAmount.toFixed(2) }}
            </td>
            <td>{{ avgTime(driOrders) }}</td>
            <td class="align-right">
              <div class="delivered-items-iocns">
                <button
                  id="open-collect-money-modal"
                  role="button"
                  class="btn btn-success btn-large collect-driver-money-btn"
                  :driver-id="deliveryDriver"
                  total-orders="4"
                  cash="271.98"
                >
                  <i class="fa fa-refresh fa"></i>
                  {{ _t('Collect Money') }}</button
                >&nbsp;
                <a
                  :id="'refresh_data-' + driOrders.driverId"
                  href
                  class="btn btn-success btn-large btnRefreshDetails btn-data-refresh"
                  style="display: none;"
                >
                  <i class="fa fa-refresh fa"></i>
                  {{ _t('Refresh Data') }} </a
                >&nbsp;
                <a
                  :id="'driver_details-' + driOrders.driverId"
                  role="button"
                  class="btn btn-info btn-large btnShowDetails btn-show-details-delivered"
                  @click="showOrders(driOrders.driverId)"
                >
                  <i class="fa fa-eye" aria-hidden="true"></i>
                  <!--{{ _t('Show Details') }}-->
                </a>
                <a
                  :class="'driver_details_hide-' + driOrders.driverId"
                  role="button"
                  class="btn btn-info btn-large btnShowDetails btn-show-details"
                  style="display: none;"
                  @click="showOrders(driOrders.driverId)"
                  ><i class="fa fa-eye-slash" aria-hidden="true"></i>
                </a>
              </div>
            </td>
          </tr>
          <tr
            style="display: none;"
            :key="driOrders.driverId"
            :class="'driver_details_hide-' + driOrders.driverId"
          >
            <td colspan="8">
              <ShowDeliveredOrderDetails
                v-show="driverId && driverId == driOrders.driverId"
              />
            </td>
          </tr>
        </template>
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
    ...mapState('deliveryManager', ['driver', 'driverId']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('deliveryManager', ['drivers', 'driverOrders', 'avgTime']),
  },
  data() {
    return {
      order: {},
      ordersDelivered: 0,
      orderTotalAmount: 0,
      orderCashAmount: 0,
      updateId: String,
      selectedDriver: '',
      totalAmount: 0,
    }
  },
  components: {
    ShowDeliveredOrderDetails,
  },
  methods: {
    averageDeliveryTime() {
      let totalAmount = 0
      let avgDeliveryTime = 0
      let drivers = 0
      if (this.driver) {
        const data = this.driverOrders[this.driver.name]
        totalAmount = parseFloat(data.totalAmount)
        return this.avgTime(data)
      } else {
        for (let driverName in this.driverOrders) {
          const data = this.driverOrders[driverName]
          totalAmount += parseFloat(data.totalAmount)
          if (data.orders.length) {
            avgDeliveryTime +=
              parseInt(data.totalDeliveryTime) / data.orders.length
          }
          drivers++
        }
        const date = new Date(avgDeliveryTime)
          .toISOString()
          .substr(11, 8)
          .split(':')
        const sec = Math.floor(parseFloat(date[2]) / drivers)
        const min = Math.floor(parseFloat(date[1]) / drivers)
        const hours = Math.floor(parseFloat(date[0]) / drivers)
        return {
          time:
            this.formatTime(hours) +
            ':' +
            this.formatTime(min) +
            ':' +
            this.formatTime(sec),
          amount: totalAmount,
        }
      }
    },
    formatTime(time) {
      let convertTime = time < 10 ? '0' + time : time
      return isNaN(convertTime) ? '00' : convertTime
    },
    ordersTotal() {
      if (this.driver) {
        const orders = this.driverOrders[this.driver.name]
        return orders
      }
    },
    showDropdown: function() {
      $('.dropdown-content').toggle()
    },
    setDriver: function(driver) {
      if (driver) {
        this.selectedDriver = driver.name
      } else {
        this.selectedDriver = 'Select Driver'
      }
      this.$store.commit('deliveryManager/SET_DRIVER', driver)
      $('.dropdown-content').hide()
    },
    showMoreDetails: function(driverId) {
      this.showMoreOrders(driverId)
      this.toggleMe(driverId)
    },
    toggleMe: function(Id) {
      this.updateId = Id
    },

    showOrders: function(driverId) {
      $('#driver_details-' + driverId).toggle()
      $('.driver_details_hide-' + driverId).toggle()
      this.showDriverOrders(driverId)
    },

    ...mapActions('deliveryManager', [
      'selectDriver',
      'showMoreOrders',
      'showDriverOrders',
    ]),
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
<style lang="scss">
tr.dataContentStyle > td > a svg {
  width: 20px;
  height: 12px;
  display: inline-block;
  vertical-align: middle;
}
.align-right {
  a {
    font-size: 12px;
    color: #fff;
  }
}
.delivered-items-iocns {
  display: flex;
  a {
    font-size: 12px;
    color: #fff;
    i {
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>
