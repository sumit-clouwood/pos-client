<template>
  <div class="inner-content-dm" v-if="dispatchOrders">
    <div
      class="block1-wrap-dp"
      v-for="(order, index) in dispatchOrders"
      :key="index"
      :id="'ds_' + order.id"
    >
      <div class="dp-box-wrap">
        <div class="dp-inner-box-wrap">
          <div class="left-inner-dp">
            <h5 class="text-capitalize">
              {{ order.order_type }} <span> {{ order.items.length }}</span>
            </h5>
            <p id="dp-order-id">#{{ order.order_no }}</p>
            <ul class="dispatch-screen-order-details">
              <li v-for="(item, itemIndex) in order.items" :key="itemIndex">
                <span> {{ item.item_quantity }} </span> {{ item.item_name }}
                <div
                  v-if="item.item_modifiers.length"
                  class="online-order-details-wrap"
                >
                  <div
                    v-for="(modifier, index) in item.item_modifiers"
                    :key="index"
                  >
                    <p
                      v-for="PMDetails in modifier.modifiers.price_modifiers"
                      :key="PMDetails._id"
                    >
                      {{ PMDetails.item_name }}
                      <!--({{ PMDetails.location_price }})-->
                    </p>
                    <p
                      v-for="MMDetails in modifier.modifiers
                        .mandatory_modifiers"
                      :key="MMDetails._id"
                    >
                      {{ MMDetails.item_name }}
                    </p>
                    <p
                      v-for="RMDetails in modifier.modifiers.regular_modifiers"
                      :key="RMDetails._id"
                    >
                      {{ RMDetails.item_name }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="right-inner-dp">
            <button class="rectangle-sample" @click="collected(order.id)">
              Collected ?
            </button>
            <h1 id="dp-order-no">{{ index + 1 }}</h1>
          </div>
        </div>
        <div class="dp-box-footer">
          {{
            humanDateTime({
              order_created: order.created_at,
              order_no: order.order_no,
            })
          }}
          <p :id="'od' + order.order_no"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import DateTime from '@/mixins/DateTime'
import { mapState } from 'vuex'

export default {
  name: 'DSItems',
  mixins: [DateTime],
  computed: {
    ...mapState('deliveryManager', ['dispatchOrders']),
  },
  methods: {
    collected: function(orderId) {
      // $('#ds_'+orderId).hide()
      this.$store.dispatch('deliveryManager/updateTakeAway', orderId)
      this.$store.dispatch('deliveryManager/getDispatchOrder')
    },
  },
  /*update() {
    if(!this.dispatchOrders){
      this.$store.dispatch('deliveryManager/getDispatchOrder')
    }
  },*/
}
</script>

<style scoped>
.inner-content-dm > div {
  float: left;
  width: 25%;
}
.online-order-details-wrap {
  padding-left: 14px;
  border-left: 2px solid #dddddd;
}
</style>
