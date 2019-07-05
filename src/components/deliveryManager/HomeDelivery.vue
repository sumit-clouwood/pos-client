<template>
  <div class="dm-order-screens dm-order-screen-change" id="home-delivery-order">
    <DMHomeDeliverySubMenu />
    <div class="dm-ready-order-wrapper" id="dm-new-order">
      <DMItem :actionDetails="readyDetails" />
    </div>

    <div class="dm-ready-order-wrapper" id="dm-waiting-for-pick">
      <section
        class="with-drivers-filter block-table-page-container pagination_disabled"
      >
        <div class="home_delivery_pick">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group form-inline float-left search">
                <div class="search-field">
                  <label for="search_AnBPx" class="">{{ _t('Filter') }}:</label
                  ><input
                    type="text"
                    placeholder="Search Waiting For Pick"
                    id="search_AnBPx"
                    class="form-control "
                  />
                </div>
              </div>
              <div class="form-group form-inline float-right limit"></div>
            </div>
          </div>
          <DMItem :actionDetails="waitingOrder" />
        </div>
        <div class="drivers-filter">
          <div class="table-drivers-filter">
            <div class="upper">
              <div class="select-driver">
                {{ _t('Select Driver') }}
              </div>
              <div class="autocomplete-container">
                <div v-if="driverList" class="driver-container">
                  <input
                    autocomplete="off"
                    type="text"
                    class="input-search-driver"
                    id="get-customer-list"
                    v-model="selectedUser"
                    @click="showDropdown"
                    @keydown="getSelectUser()"
                  />
                  <div id="my-dropdown" class="dropdown-content cursor-pointer">
                    <span
                      class="dropdown"
                      v-for="driver in driverList"
                      :key="driver._id"
                      v-on:click="selectedDriver(driver)"
                      >{{ driver.name }}</span
                    >
                  </div>
                </div>
                <div v-else class="drivers-list-note">
                  {{ _t('No Drivers Available') }}
                </div>
              </div>
            </div>
            <div class="body">
              <DMAssignedDriver />
            </div>
            <div class="driver-footer">
              <button
                type="button"
                class="button btn btn-success"
                v-if="driverBucket.length"
                @click="
                  updateOrderAction({
                    order: order,
                    orderType: order.order_type,
                    actionTrigger: 'assign_driver',
                  })
                "
              >
                <div class="button-content-container">
                  <div class="button-icon-container"><!----></div>
                  <div class="button-caption">
                    {{ _t('Assign') }}
                  </div>
                </div>
              </button>
              <button
                type="button"
                class="button btn btn-success"
                v-if="driverBucket.length"
                @click="restoreOrders"
              >
                <div class="button-content-container">
                  <div class="button-icon-container"><!----></div>
                  <div class="button-caption">
                    {{ _t('Remove All') }}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="dm-ready-order-wrapper" id="dm-delivery-in-progress">
      <DMItem :actionDetails="deliveredDetails" />
    </div>
    <div class="dm-ready-order-wrapper" id="dm-delivered">
      <DMItem :actionDetails="delivered" />
    </div>
    <OrderDetailsPopup />
    <!--<DMDeliveredItem />-->
  </div>
</template>

<script>
import DMHomeDeliverySubMenu from '@/components/deliveryManager/header/DMHomeDeliverySubMenu'
import DMItem from '@/components/deliveryManager/content/DMItem'
// import DMDeliveredItem from '@/components/deliveryManager/content/DMDeliveredItem'
import DMAssignedDriver from '@/components/deliveryManager/partial/DMAssignedDriver'
import { mapState, mapActions, mapGetters } from 'vuex'
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'

/* global $ */
export default {
  name: 'HomeDelivery',
  data() {
    return {
      readyDetails: {
        moreDetails: true,
        actionLabel: 'Ready',
        action: 'delivery_ready',
        nextOrderStatus: 'in-progress',
      },
      waitingOrder: {
        moreDetails: false,
        actionLabel: 'Assign',
        action: 'addToDriverBucket',
        driverId: '',
        nextOrderStatus: 'Ready',
      },
      deliveredDetails: {
        moreDetails: true,
        actionLabel: 'Delivered',
        action: 'delivery_done',
        nextOrderStatus: 'finished',
      },
      delivered: {
        moreDetails: false,
        actionLabel: '',
        action: '',
        nextOrderStatus: 'finished',
      },
      selectedUser: '',
    }
  },
  components: {
    DMHomeDeliverySubMenu,
    DMItem,
    OrderDetailsPopup,
    DMAssignedDriver,
  },
  computed: {
    ...mapState({
      driverList: state => state.deliveryManager.drivers,
    }),
    ...mapState('deliveryManager', ['driverBucket']),
    ...mapGetters('location', ['_t']),
  },

  mounted() {
    this.$store.dispatch('deliveryManager/fetchDMOrderDetail')
  },

  methods: {
    selectedDriver: function(driver) {
      this.waitingOrder.driverId = driver._id
      this.selectedUser = driver.name
      this.selectDriver(driver)
      $('.dropdown-content').hide()
    },
    showDropdown: function() {
      $('.dropdown-content').show()
    },
    getSelectUser: function() {
      // this.selectedUser = $('#get-customer-list').val()
    },

    ...mapActions('deliveryManager', ['selectDriver', 'restoreOrders']),
    /*imageLoadError() {
      for (let i = 0; i < document.images.length; i++) {
        document.images[i].remove()
      }
    },*/
  },
}
</script>
