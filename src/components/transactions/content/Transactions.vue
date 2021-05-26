<template>
  <div
    class="main-body-transaction color-dashboard-background color-text"
    :style="{
      display: device === 'mobile' && transactionDetailView ? 'none' : '',
    }"
  >
    <div class="search-trans-wrapper">
      <div class="back-trans-button">
        <button
          class="btn btn-success mobile-back-button"
          v-on:click="getReferPath()"
        >
          &lt; {{ _t('Back') }}
        </button>
      </div>
      <search />
    </div>

    <div :class="['food-wrapper', 'active']">
      <div v-if="displayTransactionOrders" class="left_size_details">
        <div
          class="left_info_block"
          v-for="(orders, key) in displayTransactionOrders"
          :key="key"
        >
          <p class="date_class">{{ key }}</p>
          <div
            class="detailed_block"
            v-if="typeof orders != 'undefined' && orders != null"
          >
            <div v-for="order in orders" :key="order._id">
              <div
                v-if="order.order_date == key"
                class="left_info_block"
                @click="getSelectedOrder(order)"
                :class="{
                  active: selectedOrder && selectedOrder.item._id === order._id,
                }"
              >
                <span
                  :style="{
                    color:
                      selectedOrder && selectedOrder.item._id === order._id
                        ? 'white'
                        : 'black',
                    fontSize: '0.9rem',
                    transform: 'rotate(-30deg)',
                  }"
                >
                  {{ order.order_type | orderType }}
                </span>
                <div class="img_block">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="15"
                      cy="15"
                      r="14.5"
                      fill="#DFFFCD"
                      fill-opacity="0.3"
                      stroke="#64C434"
                    ></circle>
                    <path
                      d="M9.66667 13.0001H18.3333L17.2667 13.8001C17.1966 13.8527 17.1376 13.9185 17.093 13.9938C17.0484 14.0691 17.0191 14.1525 17.0067 14.2392C16.9943 14.3258 16.9991 14.4141 17.0209 14.4989C17.0426 14.5837 17.0808 14.6634 17.1333 14.7335C17.1954 14.8163 17.276 14.8835 17.3685 14.9297C17.4611 14.976 17.5632 15.0001 17.6667 15.0001C17.8109 15.0001 17.9513 14.9533 18.0667 14.8668L20.7333 12.8668C20.8149 12.8046 20.881 12.7244 20.9264 12.6325C20.9719 12.5405 20.9956 12.4394 20.9956 12.3368C20.9956 12.2342 20.9719 12.133 20.9264 12.0411C20.881 11.9492 20.8149 11.869 20.7333 11.8068L18.16 9.80679C18.0203 9.69805 17.8432 9.64926 17.6675 9.67114C17.4918 9.69302 17.3321 9.78378 17.2233 9.92346C17.1146 10.0631 17.0658 10.2403 17.0877 10.416C17.1096 10.5916 17.2003 10.7514 17.34 10.8601L18.3867 11.6668H9.66667C9.48986 11.6668 9.32029 11.737 9.19526 11.8621C9.07024 11.9871 9 12.1566 9 12.3335C9 12.5103 9.07024 12.6798 9.19526 12.8049C9.32029 12.9299 9.48986 13.0001 9.66667 13.0001V13.0001Z"
                      fill="#64C434"
                    ></path>
                    <path
                      d="M20.3333 17.6668H11.6667L12.7333 16.8668C12.8748 16.7607 12.9683 16.6027 12.9933 16.4277C13.0183 16.2527 12.9727 16.0749 12.8667 15.9334C12.7606 15.792 12.6026 15.6985 12.4276 15.6735C12.2526 15.6484 12.0748 15.694 11.9333 15.8001L9.26665 17.8001C9.18512 17.8623 9.11903 17.9425 9.07355 18.0344C9.02806 18.1263 9.00439 18.2275 9.00439 18.3301C9.00439 18.4326 9.02806 18.5338 9.07355 18.6258C9.11903 18.7177 9.18512 18.7979 9.26665 18.8601L11.84 20.8601C11.9564 20.9504 12.0994 20.9996 12.2467 21.0001C12.3485 20.9998 12.4489 20.9763 12.5402 20.9312C12.6315 20.8861 12.7112 20.8208 12.7733 20.7401C12.8816 20.6011 12.9304 20.4249 12.9092 20.25C12.888 20.0752 12.7984 19.9158 12.66 19.8068L11.6133 19.0001H20.3333C20.5101 19.0001 20.6797 18.9298 20.8047 18.8048C20.9298 18.6798 21 18.5102 21 18.3334C21 18.1566 20.9298 17.987 20.8047 17.862C20.6797 17.737 20.5101 17.6668 20.3333 17.6668Z"
                      fill="#64C434"
                    ></path>
                  </svg>
                </div>
                <div class="price_and_name" v-if="order">
                  <p class="doller_price">
                    {{ '#' + order.order_no }} - {{ order.currency }}
                    {{ order.balance_due }}
                  </p>
                  <p
                    class="price_s_desc shorten-sentence"
                    v-if="order.items"
                    :title="getOrderItemsStr(order.items)"
                  >
                    {{ getOrderItemsStr(order.items, true) }}
                  </p>
                </div>
                <div class="time_and_button" v-if="order">
                  <p>
                    {{
                      LookupData.convertDatetimeCustom(
                        order.real_created_datetime,
                        timezoneString,
                        'hh:mm a'
                      )
                    }}
                  </p>
                  <a :class="setOrderStatus(order.order_system_status).class">{{
                    setOrderStatus(order.order_system_status).label
                  }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="food-block" v-else>
        <div class="text-danger text-center font-weight-bold">
          {{ _t('No orders found.') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import Search from './Search'
import { mapGetters, mapState } from 'vuex'
import * as CONST from '@/constants'
export default {
  name: 'Catalog',
  props: {
    msg: String,
  },
  data() {
    return {
      todayDate: moment().format('dddd, LL'),
      interval: null,
    }
  },
  filters: {
    orderType(orderType) {
      if (orderType === CONST.ORDER_TYPE_CALL_CENTER) return 'Delivery'
      if (orderType === CONST.ORDER_TYPE_DINE_IN) return 'Dine in'
      if (orderType === CONST.ORDER_TYPE_CARHOP) return 'Carhop'
      if (orderType === CONST.ORDER_TYPE_TAKEAWAY) return 'Takeaway'

      return 'Walk in'
    },
  },
  components: {
    Search,
  },
  mounted() {
    this.fetchOrders()
    this.interval = setInterval(() => {
      this.fetchOrders()
    }, 1000 * 60)
  },
  destroyed() {
    clearInterval(this.interval)
  },
  computed: {
    ...mapState('location', ['timezoneString']),
    ...mapState('transactionOrders', ['displayTransactionOrders']),
    ...mapState('order', ['selectedOrder']),
    ...mapGetters('location', ['_t', 'timezoneString']),
    ...mapGetters(['transactionDetailView', 'transactionListView', 'device']),
    ...mapGetters('transactionOrders', [
      'getOrderItemsStr',
      'setSelectedOrder',
    ]),
  },
  methods: {
    fetchOrders() {
      let scope = this
      this.$store
        .dispatch('transactionOrders/getTransactionOrders')
        .then(function() {
          scope.$store.dispatch(
            'transactionOrders/selectFirstTransactionOrder',
            {
              root: true,
            }
          )
          scope.$store.dispatch('transactionDetail')
        })
    },
    setOrderStatus(orderStatus) {
      let statusArr = []
      switch (orderStatus) {
        case 'normal':
          statusArr = { class: 'success', label: 'Success' }
          break
        case 'cancelled':
          statusArr = { class: 'canceled', label: 'Canceled' }
          break
        case 'modified':
          statusArr = { class: 'refunded', label: 'Modified' }
          break
        default:
          statusArr = { class: 'refunded', label: 'Success' }
          break
      }
      return statusArr
    },
    getSelectedOrder(order) {
      //show loader here
      this.$store.dispatch('sync/setLoader', true)
      this.$store
        .dispatch('order/selectedOrderDetails', order._id)
        .then(() => {
          //stop loader here
          this.$store.dispatch('sync/setLoader', false)
        })
        .catch()
      this.$store.dispatch('transactionDetail')
    },
    getReferPath() {
      history.go(-1)
    },
  },
}
</script>
