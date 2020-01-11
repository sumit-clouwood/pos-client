<template>
  <div>
    <div class="assigning-block" v-for="order in driverBucket" :key="order._id">
      <div class="order">
        <div class="store-info">
          <div class="store-name">
            {{ _t('From Store') }}:
            {{ getStoreName() }}
          </div>
          <div class="store-address">
            {{ _t('Address') }}: {{ order.order_city }}
          </div>
        </div>
        <div class="order-container">
          <div class="order">
            <div class="menu-items-list">
              <div class="order-id">
                {{ order.order_no }}
              </div>
              <div class="menu-items">
                Menu Item Name 2063
                <!---->
              </div>
            </div>
            <div class="delivery-info">
              {{ order.order_flat_number }}, {{ order.order_building }},
              {{ order.order_street }},
              {{ order.order_flat_number }}
              <span class="landmark"
                ><br />
                {{ _t('Near') }}:<span class="value">{{
                  order.order_nearest_landmark
                }}</span></span
              >
            </div>
            <div class="cancel-button">
              <button
                type="button"
                class="button btn btn-success"
                @click="removeAssignedOrder(order)"
              >
                <div class="button-content-container">
                  <div class="button-icon-container"><!----></div>
                  <div class="button-caption">
                    {{ _t('Remove') }}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'DMAssignedDriver',
  computed: {
    ...mapState('deliveryManager', ['driverBucket']),
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['store']),
  },
  methods: {
    removeAssignedOrder: function(order) {
      this.$store.dispatch(
        'deliveryManager/removeOrderFromDriverBucket',
        order._id
      )
    },
    getStoreName: function() {
      /*let data = this.driverBucket.find(bucket => bucket.store_id == storeId)
      return data.order_city*/
      // eslint-disable-next-line no-console
      return this.store.name
    },
  },
}
</script>
