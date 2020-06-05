<template>
  <div class="dm-order-screens dm-order-screen-change" id="home-delivery-order">
    <DMHomeDeliverySubMenu />
    <div class="dm-ready-order-wrapper" id="dm-order-acceptance">
      <Preloader :msg="_t('Loading new orders') + '...'" v-if="loading" />
      <DMItem :actionDetails="acceptanceDetails" v-else />
    </div>
    <div class="dm-ready-order-wrapper" id="dm-new-order">
      <Preloader :msg="_t('Loading new orders') + '...'" v-if="loading" />
      <DMItem :actionDetails="readyDetails" v-else />
    </div>

    <div class="dm-ready-order-wrapper" id="dm-waiting-for-pick">
      <section
        class="with-drivers-filter block-table-page-container pagination_disabled"
      >
        <div class="home_delivery_pick">
          <div class="refresh_button" @click="fetchWaitingOrders">
            <button type="button" tabindex="" class="button">
              <i class="fa fa-refresh"></i>
            </button>
          </div>
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
          <Preloader
            :msg="_t('Loading waiting for pickup orders') + '...'"
            v-if="loading"
          />
          <DMItem :actionDetails="waitingOrder" v-else />
        </div>
        <!--<span class="driver-arrow" @click="driverDetailsSidebar">-->
        <!--<i class="fa fa-chevron-left" aria-hidden="true"></i>-->
        <!--</span>-->
        <div class="drivers-filter">
          <div class="table-drivers-filter">
            <div class="upper">
              <div class="select-driver" @click="activateDriveList">
                {{ _t('Select Driver') }}
              </div>
              <div class="autocomplete-container">
                <div v-if="drivers" class="driver-container">
                  <form>
                    <input
                      autocomplete="off"
                      type="text"
                      class="input-search-driver"
                      id="get-customer-list"
                      v-model="selectedUser"
                      @click="showDropdown"
                      @keydown="getSelectUser()"
                    />
                  </form>
                  <div id="my-dropdown" class="dropdown-content cursor-pointer">
                    <span
                      class="dropdown"
                      v-for="driver in drivers"
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
                @click="showRemainingItems"
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
      <Preloader
        :msg="_t('Loading delivrey in progress orders') + '...'"
        v-if="loading"
      />
      <DMItem :actionDetails="deliveredDetails" v-else />
    </div>
    <div class="dm-ready-order-wrapper" id="dm-delivered">
      <Preloader :msg="_t('Loading delivered orders') + '...'" v-if="loading" />
      <DMDeliveredItem v-else />
      <!--<DMItem :actionDetails="delivered" />-->
    </div>
    <OrderDetailsPopup />
    <div class="pagination-customer-details" v-if="!loading">
      <paginate
        v-if="params.totalPages > 1"
        :page-count="params.totalPages"
        :page-range="1"
        :margin-pages="1"
        :clickHandler="moreOrder"
        :prev-text="_t('Prev')"
        :next-text="_t('Next')"
        :container-class="paginationDirection"
        :page-class="_t('page-item')"
        v-model="page"
      >
      </paginate>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import DMHomeDeliverySubMenu from '@/components/deliveryManager/header/DMHomeDeliverySubMenu'
import DMItem from '@/components/deliveryManager/content/DMItem'
import DMDeliveredItem from '@/components/deliveryManager/content/DMDeliveredItem'
import DMAssignedDriver from '@/components/deliveryManager/partial/DMAssignedDriver'
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'
import paginate from 'vuejs-paginate'
import Preloader from '@/components/util/progressbar'

/* global $ */
export default {
  name: 'HomeDelivery',
  data() {
    return {
      isActive: false,
      acceptanceDetails: {
        moreDetails: false,
        actionLabel: ['Accept', 'Reject'],
        action: ['delivery_accept', 'delivery_reject'],
        nextOrderStatus: 'in-progress',
      },
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
      paginationDirection: 'holdorders',
      page: 1,
      interval: null,
    }
  },
  components: {
    DMHomeDeliverySubMenu,
    DMItem,
    OrderDetailsPopup,
    DMDeliveredItem,
    DMAssignedDriver,
    paginate,
    Preloader,
  },
  computed: {
    ...mapGetters('deliveryManager', ['drivers']),
    ...mapState('deliveryManager', [
      'driverBucket',
      'params',
      'listType',
      'loading',
    ]),
    ...mapGetters('location', ['_t']),
    ...mapState('context', ['availableModules']),
  },
  updated() {
    if (this.listType == 'Waiting for Pick') {
      this.paginationDirection = ''
    } else {
      this.paginationDirection = 'holdorders'
    }
  },
  mounted() {
    this.$store.dispatch('deliveryManager/fetchDMOrderDetail')
    this.interval = setInterval(() => {
      let dmautoloader = this.listType == 'Waiting for Pick' ? false : true
      this.$store.dispatch('deliveryManager/fetchDMOrderDetail', dmautoloader)
    }, 1000 * 20)
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {
    activateDriveList() {
      this.isActive = !this.isActive
    },
    fetchWaitingOrders: function() {
      this.$store.dispatch('deliveryManager/fetchDMOrderDetail', true)
      this.$store.dispatch('deliveryManager/restoreOrders')
    },
    ...mapActions('order', ['updateOrderAction']),
    selectedDriver: function(driver) {
      this.waitingOrder.driverId = driver._id
      this.selectedUser = driver.name
      this.selectDriver(driver)
      $('.dropdown-content').hide()
    },
    showDropdown: function() {
      $('.dropdown-content').toggle()
    },
    moreOrder: function(pageNumber) {
      this.$store.commit('deliveryManager/SET_DM_PAGE', pageNumber)
      this.$store.dispatch('deliveryManager/fetchDMOrderDetail')
    },
    getSelectUser: function() {
      this.selectedUser = $('#get-customer-list').val()
    },
    showRemainingItems: function() {
      this.$store.dispatch('deliveryManager/assignBucketToDriver').then(() => {
        if (this.$store.getters['auth/multistore']) {
          this.$store.commit('deliveryManager/SECTION', 'crm')
        }
        this.$store.dispatch('deliveryManager/updateDMOrderStatus', {
          orderStatus: 'ready',
          collected: 'no',
          pageId: 'home_delivery_pick',
        })
      })
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
<style scoped lang="scss">
#my-dropdown {
  width: 100% !important;
  max-height: 7rem;
}
.driver-footer {
  padding: 1.125rem;
}
.home_delivery_pick {
  position: relative;
  .refresh_button {
    position: absolute;
    right: 5px;
    text-align: right;
    display: block;
    margin-top: 0.3125rem;
    button {
      width: 40px;
      height: 38px;
      border: medium none;
      background: #5056ca;
      border-radius: 4px;
      color: #fff;
    }
  }
}
</style>
