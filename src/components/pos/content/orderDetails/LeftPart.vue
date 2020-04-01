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
        <p class="color-text">
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
    <div v-if="orderDetails.customer">
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Customer Name:')
        }}</span>
        <p class="color-text">{{ orderDetails.customer.name }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Customer Phone Number:')
        }}</span>
        <p class="color-text">{{ orderDetails.customer.phone_number }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name color-text-invert">{{
          _t('Customer Email:')
        }}</span>
        <p class="color-text">{{ orderDetails.customer.email }}</p>
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
          {{
            getLookupData({
              lookupFrom: 'delivery_areas',
              id: orderDetails.item.order_delivery_area,
            })
          }}
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
          {{ orderDetails.item.order_flat_number }},
          {{ orderDetails.item.order_building }},
          {{ orderDetails.item.order_street }},
          {{ orderDetails.item.order_city }}
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
export default {
  name: 'LeftPart',
  props: {
    orderDetails: {},
  },
  data() {
    return {
      datetime: '',
      orderTime: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['timezoneString']),
  },
  updated() {
    clearInterval(this.orderTime)
    this.makeDate()
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
    makeDate() {
      if (
        this.orderDetails.item &&
        this.orderDetails.item.real_created_datetime
      )
        this.datetime = this.convertDatetime(
          this.orderDetails.item.real_created_datetime,
          this.timezoneString,
          'YYYY-MM-DD HH:mm:ss'
        )
    },
    /*timerClock: function() {
      return this.orderTimer(this.datetime, this.timezoneString)
    },*/
    getLookupData: function(lookup) {
      let setData = this.orderDetails.lookups[lookup.lookupFrom]._id
      let selection =
        lookup.lookupFrom == 'brand_loyalty_cards' ? false : 'name'
      return LookupData.get({
        collection: setData,
        matchWith: lookup.id,
        selection: selection,
      })
    },
    getPlacedBy(orderDetail) {
      let name = 'N/A'
      if (orderDetail) {
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
