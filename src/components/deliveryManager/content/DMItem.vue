<template>
  <div class="table-responsive" v-if="orders">
    <table class="table table-block-page">
      <!--<thead>
                      <tr>
                        <th class="sortable ">
                          <span title="" class="heading">Block</span
                          ><span class="sort-icon float-right fas fa-sort"></span>
                        </th>
                      </tr>
                    </thead>-->
      <!--<tfoot>
          <tr>
            <td colspan="1">Paginations</td>
          </tr>
        </tfoot>-->
      <tbody>
        <tr :key="index" v-for="(order, index) in orders">
          <td v-if="order.order_status == orderStatus">
            <div class="order-item">
              <div class="order-header">
                <div class="number-id-button">
                  <span class="order-id">
                    <span
                      @click="selectedOrderDetails(order._id)"
                      class="open-details-popup cursor-pointer"
                      data-dismiss="modal"
                      data-target=".bd-example-modal-lg"
                      data-toggle="modal"
                    >
                      #{{ order.order_no }}
                    </span>
                  </span>
                </div>
                <div class="order_price-container">
                  <div class="order_price">
                    {{ order.balance_due + ' ' + order.currency }}
                  </div>
                </div>
                <div class="order_time">
                  {{
                    convertDatetime(order.real_created_datetime, timezoneString)
                  }}
                </div>
                <div class="button-block" style="visibility: visible;">
                  <div v-if="actionDetails.action != ''">
                    <span
                      v-if="
                        orderStatus == 'ready' && actionDetails.driverId == ''
                      "
                    >
                      <span class="select-driver-caption assign_driver">
                        Select driver
                      </span>
                    </span>
                    <button
                      v-else
                      @click="
                        updateOrderAction({
                          order: order,
                          orderType: order.order_type,
                          actionTrigger: actionDetails.action,
                        })
                      "
                      class="button text-button btn btn-success"
                      type="button"
                    >
                      <div class="button-content-container">
                        <div class="button-icon-container"><!----></div>
                        <div class="button-caption">
                          {{ actionDetails.actionLabel }}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
                <div>
                  {{
                    LookupData.get({
                      collection: branch,
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
                    :key="index"
                    class="order-name"
                    v-for="(i, index) in order.items"
                  >
                    <div class="main-item">
                      {{
                        typeof order.items[index] != 'undefined'
                          ? order.items[index].name
                          : ''
                      }}<span></span>
                    </div>
                    <div
                      :key="index"
                      class="modifiers"
                      v-for="(item, index) in order.item_modifiers"
                    >
                      <span v-if="item.for_item == i.no">
                        <span v-if="item.qty > 0">+{{ item.qty }}</span>
                        {{ item.name }}
                        <!--<img
                            class="food-icon"
                            src="https://fakeimg.pl/19x20/?text=Second&amp;font=lobster%22"
                          /><img
                            class="food-icon"
                            src="https://fakeimg.pl/19x19/?text=Second&amp;font=lobster%22"
                          />-->
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="order-footer">
                <p class="color-text">
                  <span
                    id="runningtime"
                    class="timeago elapsedTime delManTime"
                    title=""
                  ></span>
                  <span
                    class="customtime left"
                    :id="
                      'createdOrder-' +
                        convertDatetime(
                          order.real_created_datetime,
                          timezoneString
                        )
                    "
                    style="display: none"
                  ></span>
                  <input
                    type="hidden"
                    id="storerunningtime"
                    :value="
                      convertDatetime(
                        order.real_created_datetime,
                        timezoneString
                      )
                    "
                  />
                </p>
                <div class="runningtimes">
                  <div class="order-delivery-area"></div>
                  <div class="order-address">
                    {{ order.order_flat_number }}, {{ order.order_building }},
                    {{ order.order_street }},
                    {{ order.order_city }}
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
import { mapState, mapActions, mapGetters } from 'vuex'
import DateTime from '@/mixins/DateTime'

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
  mixins: [DateTime],
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['timezoneString']),
    ...mapState({
      orderStatus: state => state.deliveryManager.deliveryOrderStatus,
    }),
    ...mapState({
      branch: state => state.deliveryManager.availableStores,
    }),
    ...mapGetters('deliveryManager', ['orders']),
  },
  methods: {
    ...mapActions('deliveryManager', ['showOrderDetails']),
    ...mapActions('order', ['selectedOrderDetails', 'updateOrderAction']),
  },
}
</script>
