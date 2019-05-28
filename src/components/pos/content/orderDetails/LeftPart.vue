<template>
  <div class="details row">
    <div class="col-md-6" v-if="orderDetails">
      <div class="details-item">
        <span class="details-item-name">Order No:</span>
        <p>{{ orderDetails.item.order_no }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Order Status:</span>
        <p>{{ orderDetails.item.order_status }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Order Type:</span>
        <p>{{ orderDetails.item.order_type }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Location/Branch:</span>
        <p>{{ orderDetails.store_name }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Order Date/Time:</span>
        <p>{{ orderDetails.item.created_at.date }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Order Duration:</span>
        <p>
          3 weeks, 6 days, 3 hours, 2 minutes, 3 seconds
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Placed By:</span>
        <p>Seeding</p>
      </div>
    </div>
    <div class="col-md-6">
      <div class="details-item">
        <span class="details-item-name">Customer Name:</span>
        <p>{{ orderDetails.customer.name }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Customer Phone Number:</span>
        <p>{{ orderDetails.customer.phone_number }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Customer Email:</span>
        <p>{{ orderDetails.customer.email }}</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Loyalty Points Earned:</span>
        <p>N/A</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Delivery Area:</span>
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
        <span class="details-item-name">Driver:</span>
        <p>
          {{
            getLookupData({ lookupFrom: 'users', id: orderDetails.item.driver })
          }}
        </p>
      </div>
      <div class="details-item details-item-double-span">
        <span class="details-item-name">Order Delivery Address:</span>
        <p>
          {{ orderDetails.item.order_flat_number }},
          {{ orderDetails.item.order_building }},
          {{ orderDetails.item.order_street }},
          {{ orderDetails.item.order_city }}
        </p>
      </div>
    </div>

    <!----><!---->
    <!--    <div class="divider"></div>-->
  </div>
</template>

<script>
import LookupData from '@/plugins/helpers/LookupData'

export default {
  name: 'LeftPart',
  props: {
    orderDetails: {},
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
