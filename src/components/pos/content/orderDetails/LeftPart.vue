<template>
  <div class="details">
    <div v-if="orderDetails">
      <div class="details-item">
        <span class="details-item-name">{{ _t('Order No:') }}</span>
        <p>{{ orderDetails.item.order_no }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">{{ _t('Order Status:') }}</span>
        <p>{{ orderDetails.item.order_status }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">{{ _t('Order Type:') }}</span>
        <p>{{ orderDetails.item.order_type }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">{{ _t('Location/Branch:') }}</span>
        <p>{{ orderDetails.store_name }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">{{ _t('Order Date/Times') }}:</span>
        <p>{{ orderDetails.item.created_at.date }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">{{ _t('Order Duration:') }}</span>
        <p>
          3 weeks, 6 days, 3 hours, 2 minutes, 3 seconds
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name">{{ _t('Placed By:') }}</span>
        <p>Seeding</p>
      </div>
    </div>
    <div v-if="orderDetails.customer">
      <div class="details-item">
        <span class="details-item-name">{{ _t('Customer Name:') }}</span>
        <p>{{ orderDetails.customer.name }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">{{
          _t('Customer Phone Number:')
        }}</span>
        <p>{{ orderDetails.customer.phone_number }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">{{ _t('Customer Email:') }}</span>
        <p>{{ orderDetails.customer.email }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">{{
          _t('Loyalty Points Earned:')
        }}</span>
        <p>N/A</p>
      </div>
    </div>
    <div v-if="orderDetails.item">
      <div class="details-item">
        <span class="details-item-name">{{ _t('Delivery Area:') }}</span>
        <p>
          {{
            getLookupData({
              lookupFrom: 'store_delivery_areas',
              id: orderDetails.item.order_delivery_area,
            })
          }}
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name">{{ _t('Driver:') }}</span>
        <p>
          {{
            getLookupData({
              lookupFrom: 'users',
              id: orderDetails.item.driver,
            })
          }}
        </p>
      </div>
      <div class="details-item details-item-double-span">
        <span class="details-item-name">{{
          _t('Order Delivery Address:')
        }}</span>
        <p>
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
import LookupData from '@/plugins/helpers/LookupData'
import { mapGetters } from 'vuex'
export default {
  name: 'LeftPart',
  props: {
    orderDetails: {},
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
  methods: {
    getLookupData: function(lookup) {
      let setData = this.orderDetails.lookups[lookup.lookupFrom]._id
      return LookupData.get({
        collection: setData,
        matchWith: lookup.id,
        selection: 'name',
      })
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
