<template>
  <div>
    <Preloader v-if="loading" />
    <div v-else class="running-order-table-wrap">
      <table class="table" id="running-order">
        <thead>
          <tr class="dine-table-heading">
            <th width="200px">{{ _t('TABLE NUMBER') }}</th>
            <!--<th width="100px">{{ _t('STATUS') }}</th>-->
            <th width="450px">{{ _t('ORDERS') }}</th>
            <th width="200px">{{ _t('AMOUNT') }}</th>
            <th width="250px">{{ _t('TABLE BOOKED TIME') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="4">
              <p class="font-weight-bold text-danger text-center color-warning">
                {{ _t('No order found') }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-customer-details">
      <paginate
        v-if="totalReservations.totalPages"
        :page-count="totalReservations.totalPages"
        :page-range="2"
        :margin-pages="2"
        :clickHandler="fetchMore"
        :prev-text="_t('Prev')"
        :next-text="_t('Next')"
        :container-class="''"
        :page-class="_t('page-item')"
        v-model="page"
      ></paginate>
    </div>
  </div>
</template>

<script>
/*global $*/
import { mapState, mapGetters, mapActions } from 'vuex'
import DateTime from '@/mixins/DateTime'
import Preloader from '@/components/util/Preloader'
import paginate from 'vuejs-paginate'

export default {
  name: 'OrderList',
  props: {
    tabName: String,
    lookup: String,
  },
  components: {
    Preloader,
    paginate,
  },
  data() {
    return {
      orderDetails: false,
      timerTime: false,
      isOrderCancelledClass: 'table-order-view',
      page: 1,
    }
  },
  updated() {
    // let scope = this
    // $('#running-order tbody .dine-table-content').each(function() {
    // let orderDateTime = this.timerTime
    /*// setInterval(() => {
    let orderDateTime = parseInt($.trim(this.timerTime))
    let orderTime = this.timerClock(orderDateTime)
    $(this)
      .find('span.runningtime')
      .html(orderTime)
    // }, 1000)*/
    // })
    // setInterval(() => {}, 1000)
  },
  mixins: [DateTime],
  computed: {
    ...mapState('location', ['timezoneString']),
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['orders', 'loading', 'totalReservations']),
    ...mapGetters('dinein', ['getOrderStatus', 'getTableNumber']),
  },
  methods: {
    setTime(timerTime) {
      let timeZoneTime =
        typeof timerTime != 'undefined' ? timerTime.$date.$numberLong : 'false'
      if (timeZoneTime) {
        return this.timerClock(parseInt($.trim(timeZoneTime)))
        /*$(this)
          .find('span.runningtime')
          .html(orderTime)*/
      }
    },
    fetchMore(pageNumber) {
      let pageInformation = {
        pageNumber: pageNumber,
        tabName: this.tabName,
        loader: true,
      }
      this.fetchMoreReservations(pageInformation)
    },
    ...mapActions('order', ['selectedOrderDetails']),
    ...mapActions('dinein', [
      'reservationUpdateStatus',
      'fetchMoreReservations',
    ]),
    getOrderDetails(collection) {
      // eslint-disable-next-line no-console
      this.orderDetails = collection.collection[collection.matchWith]
      // console.log(collection)
      this.isOrderCancelledClass =
        this.orderDetails.order_system_status !== 'cancelled'
          ? 'table-order-view'
          : 'table-order-view'
    },
    timerClock(datetime) {
      return this.orderTimer(
        this.convertDatetime(datetime, this.timezoneString),
        this.timezoneString
      )
    },
    payNow(orderId) {
      // eslint-disable-next-line no-console
      console.log(orderId, this.$store)
    },
    showMoreOrderItems(id) {
      // $('.table-order-view').removeClass('active')
      $('#id_' + id)
        .closest('.table-order-view')
        .toggleClass('active')
    },
    setRouter(data) {
      this.$store.commit('dinein/RESERVATION_ID', data.orderData._id)
      this.$store.commit('dinein/ORDER_RESERVATION_DATA', data.orderData)
      this.$store.dispatch('dinein/getSelectedOrder', data.orderId, {
        root: true,
      })
      this.$store.dispatch('order/updateOrderType', {
        OTview: 'Dine In',
        OTApi: 'dine_in',
      })
      this.$router.push({ path: data.url })
    },
  },
}
</script>
