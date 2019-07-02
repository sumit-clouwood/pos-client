<template>
  <div class="table-responsive" v-if="orderDetails">
    <table class="table table-block-page">
      <!--<thead>
        <tr>
          <th class="sortable ">
            <span title="" class="heading">Block</span
            ><span class="sort-icon float-right fas fa-sort"></span>
          </th>
        </tr>
      </thead>-->
      <tfoot>
        <tr>
          <td colspan="1">Paginations</td>
        </tr>
      </tfoot>
      <tbody>
        <tr v-for="(order, index) in orderDetails" :key="index">
          <td class="">
            <div class="order-item">
              <div class="order-header">
                <div class="number-id-button">
                  <span class="order-id"
                    ><span class="open-details-popup">
                      #{{ order.order_no }}
                    </span></span
                  >
                </div>
                <div class="order_price-container">
                  <div class="order_price">
                    {{ order.balance_due + ' ' + order.currency }}
                  </div>
                </div>
                <div class="order_time">08:22 PM</div>
                <div class="button-block" style="visibility: visible;">
                  <button
                    type="button"
                    class="button text-button btn btn-success"
                  >
                    <div class="button-content-container">
                      <div class="button-icon-container"><!----></div>
                      <div class="button-caption">
                        Ready
                      </div>
                    </div></button
                  ><!---->
                </div>
                <div>
                  {{
                    LookupData.get({
                      collection: order,
                      matchWith: order.store_id,
                      selection: 'name',
                    })
                  }}
                </div>
                <div></div>
              </div>
              <div class="order-body">
                <div class="order-items-list">
                  <div
                    class="order-name"
                    v-for="(i, index) in order.items"
                    :key="index"
                  >
                    <div class="main-item">
                      {{
                        typeof order.items[index] != 'undefined'
                          ? order.items[index].name
                          : ''
                      }}<span></span>
                    </div>
                    <div
                      class="modifiers"
                      v-for="(item, index) in order.item_modifiers"
                      :key="index"
                    >
                      <span v-if="item.for_item == i.no">
                        {{ item.name }}
                        <img
                          class="food-icon"
                          src="https://fakeimg.pl/19x20/?text=Second&amp;font=lobster%22"
                        /><img
                          class="food-icon"
                          src="https://fakeimg.pl/19x19/?text=Second&amp;font=lobster%22"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="order-footer">
                <div class="runningtime">
                  <div class="order-delivery-area"></div>
                  <div class="order-address">
                    {{ order.order_flat_number }}, {{ order.order_building }},
                    {{ order.order_street }}, {{ order.order_flat_number }}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapActions } from 'vuex'
export default {
  name: 'DMItem',
  data() {
    return {
      orderCount: 2,
    }
  },
  props: {
    actionDetails: Object,
  },
  computed: {
    ...mapState({
      orderStatus: state => state.deliveryManager.deliveryOrderStatus,
    }),
    ...mapState({
      orderDetails: state => state.deliveryManager.orders,
      /*foodIcons: state => state.modifiers.foodIcons,*/
    }),
    ...mapState({
      locationName: state => state.location.locationName,
    }),
  },
  methods: {
    ...mapActions('deliveryManager', ['showOrderDetails']),
    DMOrderStatus: function({ actionDetails, orderId, orderType }) {
      let timestamp = Date.now()
      if (actionDetails.action != 'Collected') {
        if (orderType.OTApi === 'takeaway') {
          this.$store.dispatch('deliveryManager/updateTakeAway', orderId)
        } else {
          if (typeof actionDetails.driverId != 'undefined') {
            this.$store.dispatch('deliveryManager/attachOrderDriver', {
              orderId: orderId,
              driverId: actionDetails.driverId,
              timestamp: timestamp,
            })
          } else {
            this.$store.dispatch('checkout/updateOrderStatus', {
              orderStatus: actionDetails.nextOrderStatus,
              orderId: orderId,
              timestamp: timestamp,
              orderType: orderType,
            })
          }
        }

        $('#' + orderId)
          .parent()
          .parent()
          .parent()
          .hide(800)
      }
    },
  },
}
</script>

<style scoped lang="css">
div#dm-new-order table {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

div#dm-new-order thead {
  grid-row-start: 2;
  grid-row-end: 3;
}

div#dm-new-order tfoot {
  grid-row-start: 3;
  grid-row-end: 4;
  display: block;
  width: 100%;
  background: rgba(63,74,74,0.6);
}
div#dm-new-order tbody{
  grid-row-start: 1;
  grid-row-end: 2;
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: .625rem;
  grid-row-gap: .625rem;
  padding: 2.5rem 3.75rem;;
  word-break: break-word;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.order-item{

  -webkit-box-shadow: 0 0px 0.0625rem 0 rgba(23, 23, 32, 0.05), 0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05), 0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05), 0 0px 0.375rem 0 rgba(23, 23, 32, 0.05), 0 0px 0.75rem 0 rgba(23, 23, 32, 0.05);
  box-shadow: 0 0px 0.0625rem 0 rgba(23, 23, 32, 0.05), 0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05), 0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05), 0 0px 0.375rem 0 rgba(23, 23, 32, 0.05), 0 0px 0.75rem 0 rgba(23, 23, 32, 0.05);
  margin: .625rem;
  height: 100%;
  border-radius: 4px;
  background-color: #fff;

}
.order-item .order-header {
  display: grid;
  grid-template-columns: 1fr auto;
  color: rgba(63,74,74,0.8);
  font-weight: 600;
  padding-top: .75rem;
  padding-left: 1.25rem;
  padding-right: .75rem;
  margin-bottom: 0;
  font-size:0.9rem;
}
.order-item .order-header .button-block {
  grid-row-end: span 2;
}
.order-item .order-body {
  display: grid;
  grid-template-columns: 1fr auto;
  letter-spacing: .5px;
  color: rgba(63,74,74,0.6);
  height: calc(50vh - 17rem);
  min-height: 115px;
  overflow-y: auto;
  padding-left: .9375rem;
  padding-right: .625rem;
  margin-right: .625rem;
  margin-left: .3125rem;
  margin-top: .625rem;
  margin-bottom: .625rem;
  font-size: 1rem;
}
.order-item .order-footer .runningtime {
  grid-column-start: 1;
  grid-column-end: 3;
  background: #f5f6f6;
  border-bottom-left-radius: .25rem;
  border-bottom-right-radius: .25rem;
  text-align: center;
  padding: .625rem;
}
.order-item .order-header .order-id {
  color: #49a218;
  font-weight: 400;
}
div.order-address{
  color: rgba(63,74,74,0.8);
  font-size: 14px;

}
.order-item .order-body .order-items-list .modifiers {
  font-size: .7rem;
  padding-left: 1rem;
}
.food-icon {
  margin-left: 0.125rem;
  margin-right: 0.125rem;
  margin-bottom: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
}
</style>
