<template>
  <div class="details">
    <div v-if="orderDetails">
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Order No:')
        }}</span>
        <p class="color-text">{{ orderDetails.item.order_no }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Order Status:')
        }}</span>
        <p class="color-text text-capitalize">
          {{
            LookupData.replaceUnderscoreHyphon(orderDetails.item.order_status)
          }}
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Order Type:')
        }}</span>
        <p class="color-text text-capitalize">
          {{ LookupData.replaceUnderscoreHyphon(orderDetails.item.order_type) }}
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Location/Branch:')
        }}</span>
        <p class="color-text">{{ orderDetails.store_name }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert"
          >{{ _t('Order Date/Times') }}:</span
        >
        <p class="color-text">
          <!--<b>{{ _t('Order Date:') }}</b>-->
          {{
            convertDatetime(
              orderDetails.item.real_created_datetime,
              timezoneString
            )
          }}
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Order Duration:')
        }}</span>
        <p
          class="color-text"
          v-if="orderDetails.item.future_order_datetime !== ''"
        >
          <b>{{ _t('Future Date') }}: </b>{{ future_order_date }} <br />
          <b>{{ _t('Store Date') }}: </b>{{ store_order_date }}
        </p>
        <p class="color-text" v-else>
          <span
            id="runningtime"
            class="timeago elapsedTime delManTime"
            title=""
          >
          </span>
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert"
          >{{ _t('Placed By') }}:</span
        >
        <p class="color-text">
          {{ getPlacedBy(orderDetails) }}
        </p>
      </div>
      <div
        class="details-item"
        v-if="
          orderDetails.item.aggregator_data &&
            orderDetails.item.aggregator_data.riderPickupTime !== 'undefined' &&
            orderDetails.item.aggregator_data.riderPickupTime !== null
        "
      >
        <span class="details-item-name color-text-invert"
          >{{ _t('Rider Order Pickup Time') }}:</span
        >
        <p class="color-text">
          {{
            convertDatetime(
              orderDetails.item.aggregator_data.riderPickupTime,
              timezoneString
            )
          }}
        </p>
      </div>
      <div class="details-item" v-if="orderDetails.item.token_number">
        <span class="details-item-name color-text-invert"
          >{{ _t('Token Number') }}:
        </span>
        <p class="color-text">
          {{ orderDetails.item.token_number }}
        </p>
      </div>
      <div class="details-item" v-if="orderDetails.table_number">
        <span class="details-item-name color-text-invert">{{
          _t('Table Number')
        }}</span>
        <p class="color-text">
          {{ orderDetails.table_number }}
        </p>
      </div>
    </div>
    <div
      v-if="
        orderDetails.customer ||
          (orderDetails.item && orderDetails.item.guest_checkout)
      "
    >
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Customer Name:')
        }}</span>
        <p class="color-text">
          {{
            orderDetails.item.guest_checkout
              ? orderDetails.item.guest_customer.name
              : orderDetails.customer.name
          }}
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Customer Phone Number:')
        }}</span>
        <p class="color-text">
          {{
            orderDetails.item.guest_checkout
              ? orderDetails.item.guest_customer.phone_number
              : orderDetails.customer.phone_number
          }}
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Customer Email:')
        }}</span>
        <p class="color-text">
          {{
            orderDetails.item.guest_checkout
              ? orderDetails.item.guest_customer.email
              : orderDetails.customer.email
          }}
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert"
          >{{ _t('Loyalty Points Earned') }}:</span
        >
        <p class="color-text">
          {{
            orderDetails.item.loyalty_cards_with_points &&
            orderDetails.item.loyalty_cards_with_points.length
              ? getLookupData({
                  lookupFrom: 'brand_loyalty_cards',
                  id: orderDetails.item.loyalty_cards_with_points[0].card_id,
                }).loyalty_card_code
              : ''
          }}
          :
          {{ getLoyaltyPoint(orderDetails.item) }}
        </p>
      </div>
    </div>
    <div v-if="orderDetails.item && orderDetails.item.order_type !== 'dine_in'">
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Delivery Area:')
        }}</span>
        <p class="color-text">
          {{ getDeliveryArea(orderDetails.item.order_delivery_area) }}
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Driver:')
        }}</span>
        <p class="color-text">
          {{
            orderDetails.item.driver
              ? getLookupData({
                  lookupFrom: 'users',
                  id: orderDetails.item.driver,
                })
              : 'Not Assigned'
          }}
        </p>
      </div>
      <div class="details-item details-item-double-span">
        <span class="details-item-name color-text-invert">{{
          _t('Order Delivery Address:')
        }}</span>
        <p class="color-text">
          <span v-if="orderDetails.item.order_flat_number"
            >{{ orderDetails.item.order_flat_number }},</span
          >
          <span v-if="orderDetails.item.order_building"
            >{{ orderDetails.item.order_building }},</span
          >
          <span v-if="orderDetails.item.order_street"
            >{{ orderDetails.item.order_street }},</span
          >
          <span v-if="orderDetails.item.order_city">{{
            orderDetails.item.order_city
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/*global $*/
import LookupData from '@/plugins/helpers/LookupData'
import { mapGetters, mapState } from 'vuex'
import DateTime from '@/mixins/DateTime'
import moment from 'moment-timezone'
export default {
  name: 'LeftPart',
  props: {
    orderDetails: {},
  },
  data() {
    return {
      datetime: '',
      orderTime: '',
      future_order_date: '',
      store_order_date: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('customer', ['getDeliveryArea']),
    ...mapState('location', ['timezoneString']),
  },
  updated() {
    clearInterval(this.orderTime)
    if (this.orderDetails && this.orderDetails.item) {
      this.makeDate(this.orderDetails.item)
      this.makeDate(this.orderDetails.item)
    }
    this.orderTime = setInterval(() => {
      $('#runningtime').text(
        this.orderTimer(this.datetime, this.timezoneString)
      )
    }, 1000)
  },
  destroyed() {
    clearInterval(this.orderTime)
  },
  mixins: [DateTime],
  methods: {
    makeDate(datetime) {
      if (datetime.real_created_datetime)
        this.datetime = this.convertDatetime(
          datetime.real_created_datetime,
          this.timezoneString,
          'YYYY-MM-DD HH:mm:ss'
        )
      if (datetime.future_order_datetime) {
        let date_time =
          datetime.future_order_datetime != '' &&
          typeof datetime.future_order_datetime.$date != 'undefined'
            ? parseInt(datetime.future_order_datetime.$date.$numberLong)
            : ''
        let date = new Date(date_time)
        this.future_order_date = moment(date).format('Do MMM YYYY,  hh:mm:ss A')
      }
      if (datetime.future_order_datetime)
        this.store_order_date = this.convertDatetime(
          datetime.future_order_datetime,
          this.timezoneString,
          'Do MMM YYYY,  hh:mm:ss A'
        )
    },
    /*timerClock: function() {
      return this.orderTimer(this.datetime, this.timezoneString)
    },*/
    getLookupData: function(lookup) {
      let setData = this.orderDetails.lookups[lookup.lookupFrom]
        ? this.orderDetails.lookups[lookup.lookupFrom]._id
        : ''
      let selection =
        lookup.lookupFrom == 'brand_loyalty_cards' ? false : 'name'
      return LookupData.get({
        collection: setData,
        matchWith: lookup.id,
        selection: selection,
      })
    },
    getPlacedBy(orderDetail) {
      if (orderDetail.item.guest_checkout) {
        return this._t('Guest')
      }
      let name = 'N/A'
      if (orderDetail && orderDetail.lookups.users._id.length > 0) {
        name = Object.values(orderDetail.lookups.users._id)[0]['name']
      }
      return name
    },
    getLoyaltyPoint(orderItem) {
      return orderItem.loyalty_cards_with_points.length
        ? orderItem.loyalty_cards_with_points[0].points
        : 0
    },
  },
}
</script>

<style scoped lang="scss">
.details.row {
  margin: 25px;
}

span.details-item-name {
  font-weight: bold;
}
</style>
