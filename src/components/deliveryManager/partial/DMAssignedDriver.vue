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

<style scoped lang="css">
.table-drivers-filter .body .assigning-block .order {
    display: grid;
    grid-template-rows: auto 1fr;
}
.table-drivers-filter .body .assigning-block .order .store-info {
    font-size: 16px;
    font-weight: 600;
    padding: 0.3125rem 0.625rem;
    background: rgba(63, 74, 74, 0.05);
    overflow: hidden;
}
.table-drivers-filter .body .assigning-block .order .store-info .store-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.table-drivers-filter .body .assigning-block .order .store-info .store-address {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.table-drivers-filter .body .assigning-block .order .order-container .order {
    position: relative;
    padding-bottom: 0.3125rem;
}
.table-drivers-filter .body .assigning-block .order {
    display: grid;
    grid-template-rows: auto 1fr;
}
.table-drivers-filter
.body
.assigning-block
.order
.order-container
.menu-items-list {
    border-top: 1px solid rgba(63, 74, 74, 0.3);
    display: grid;
    grid-template-columns: auto 1fr;
    grid-column-gap: 0.625rem;
    padding: 0.3125rem 0.625rem;
}
.table-drivers-filter
.body
.assigning-block
.order
.order-container
.delivery-info {
    height: 100%;
    overflow: auto;
    padding: 0.625rem;
}
.table-drivers-filter
.body
.assigning-block
.order
.order-container
.order
.cancel-button {
    justify-self: right;
    position: absolute;
    bottom: 0px;
    right: 0px;
}
.table-drivers-filter
.body
.assigning-block
.order
.order-container
.order
.cancel-button
.button {
    padding: 0.4375rem 0.3125rem;
}
.button .button-content-container {
    white-space: nowrap;
}
.button .button-content-container .button-caption {
    display: inline-block;
}
.driver-footer > button {
    margin-right: 10px;
}
</style>
