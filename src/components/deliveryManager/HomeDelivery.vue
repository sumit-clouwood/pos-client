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
              <div class="assigning-block">
                <div class="order">
                  <div class="store-info">
                    <div class="store-name">
                      From Store: Store Store Name 756
                    </div>
                    <div class="store-address">
                      Address: Store City 761, Store Address Line 760
                    </div>
                  </div>
                  <div class="order-container">
                    <div class="order">
                      <div class="menu-items-list">
                        <div class="order-id">
                          13
                        </div>
                        <div class="menu-items">
                          Menu Item Name 2063
                          <!---->
                        </div>
                      </div>
                      <div class="delivery-info">
                        Order Flat Number 6013, Order Building/Villa 6011, Order
                        Street 6012, Order City 6015
                        <span class="landmark"
                          ><br />Near:
                          <span class="value"
                            >Order Nearest Landmark 6014</span
                          ></span
                        >
                      </div>
                      <div class="cancel-button">
                        <button type="button" class="button btn btn-success">
                          <div class="button-content-container">
                            <div class="button-icon-container"><!----></div>
                            <div class="button-caption">
                              Remove
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="driver-footer">
              <button type="button" class="button btn btn-success" style="">
                <div class="button-content-container">
                  <div class="button-icon-container"><!----></div>
                  <div class="button-caption">
                    Assign
                  </div>
                </div></button
              ><button type="button" class="button btn btn-success" style="">
                <div class="button-content-container">
                  <div class="button-icon-container"><!----></div>
                  <div class="button-caption">
                    Remove All
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

    <DMDeliveredItem />
  </div>
</template>

<script>
import DMHomeDeliverySubMenu from '@/components/deliveryManager/header/DMHomeDeliverySubMenu'
import DMItem from '@/components/deliveryManager/content/DMItem'
import DMDeliveredItem from '@/components/deliveryManager/content/DMDeliveredItem'
import { mapState, mapActions, mapGetters } from 'vuex'
/* global $ */
export default {
  name: 'HomeDelivery',
  data() {
    return {
      readyDetails: {
        moreDetails: true,
        action: 'Ready',
        nextOrderStatus: 'in-progress',
      },
      waitingOrder: {
        moreDetails: false,
        action: 'Assign',
        driverId: '',
        nextOrderStatus: 'Ready',
      },
      deliveredDetails: {
        moreDetails: true,
        action: 'Ready',
        nextOrderStatus: 'finished',
      },
      selectedUser: '',
    }
  },
  components: {
    DMHomeDeliverySubMenu,
    DMItem,
    DMDeliveredItem,
  },
  computed: {
    ...mapState({
      driverList: state => state.deliveryManager.drivers,
    }),
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
    ...mapActions('deliveryManager', ['selectDriver']),
    /*imageLoadError() {
      for (let i = 0; i < document.images.length; i++) {
        document.images[i].remove()
      }
    },*/
  },
}
</script>

<style scoped>
.driverImg {
  padding-left: 14px;
  float: left;
}
.with-drivers-filter .drivers-filter {
  overflow: auto;
  float: right;
  width: 20%;
  height: 100%;
  border-left: 1px solid rgba(63, 74, 74, 0.3);
}

.with-drivers-filter .home_delivery_pick {
  overflow: auto;
  height: 100%;
  display: inline-block;
  width: 80%;
}
.block-table-page-container .row {
  display: none;
}
.table-drivers-filter .upper .select-driver {
  padding: 0.7rem;
  background-color: #f30105;
  color: #fff;
  font-weight: 600;
}
.table-drivers-filter .upper {
  border-bottom: 1px solid rgba(63, 74, 74, 0.3);
  display: grid;
  grid-template-columns: auto 1fr;
  border-top: 1px solid rgba(63, 74, 74, 0.3);
}
.table-drivers-filter {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
}
.table-drivers-filter .upper .autocomplete-container {
  padding: 0rem 1rem;
}
.table-drivers-filter .upper .autocomplete-container .drivers-list-note {
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
}
.table-drivers-filter .body {
  padding: 0.3125rem 0.625rem;
  overflow: auto;
}
.table-drivers-filter .driver-footer {
  background-color: #f30105;
  width: 100%;
  height: 100%;
  text-align: right;
  padding: 2px;
}
.button .button-content-container .button-caption {
  display: inline-block;
}
.button .button-content-container .button-icon-container {
  display: inline-block;
}
.table-drivers-filter {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
}
.block-table-page-container {
  width: 100%;
  height: 100%;
  background-color: transparent;
}

/*search driver*/
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f6f6f6;
  width: 100%;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
  margin-top: 3px;
  max-height: 200px;
}

.dropdown-content span {
  color: black;
  padding: 6px 16px;
  text-decoration: none;
  display: block;
}
.input-search-driver {
  width: 100%;
  padding-bottom: 11px;
  height: 40px;
  border: medium none;
  border-bottom: 1px solid #ddd;
  padding: 0;
}
.dropdown:hover {
  background-color: #ddd;
}
.driver-container {
  position: relative;
}
.input-search-driver:focus {
  outline: none;
}
.table-drivers-filter .body .assigning-block {
  -webkit-box-shadow: 0 0px 0.0625rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.375rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.75rem 0 rgba(23, 23, 32, 0.05);
  box-shadow: 0 0px 0.0625rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.375rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.75rem 0 rgba(23, 23, 32, 0.05);
  margin: 0.9375rem 0.625rem;
  height: auto;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
}
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
