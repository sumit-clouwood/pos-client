<template>
  <div>
    <div
      class="assigning-block"
      v-for="order in assignToBucket"
      :key="order._id"
    >
      <div class="order">
        <div class="store-info">
          <div class="store-name">
            {{ _t('From Store') }}:
            {{
              LookupData.get({
                collection: assignToBucket,
                matchWith: order.store_id,
                selection: 'name',
              })
            }}
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
                @click="removeAssignedOrder(order._id)"
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
    ...mapState('order', ['assignToBucket']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    removeAssignedOrder: function(order) {
      this.$store.commit('order/RE_ASSIGNED_BUCKET', order)
    },
  },
}
</script>
