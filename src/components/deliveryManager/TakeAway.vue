<template>
  <div
    class="dm-order-take-away dm-order-screen-change"
    id="home-delivery-order"
    style="display: grid;"
  >
    <DMTakeAwaySubMenu />
    <div
      class="dm-ready-order-wrapper"
      id="new-Collections"
      style="display: grid"
    >
      <Preloader :msg="_t('Loading new orders') + '...'" v-if="loading" />
      <!--suppress XmlDuplicatedId -->
      <div id="dm-new-order" v-else>
        <DMItem :actionDetails="actionDetailsNew" />
      </div>
    </div>
    <div class="dm-ready-order-wrapper" id="Waiting-for-Collections">
      <Preloader :msg="_t('Loading new orders') + '...'" v-if="loading" />
      <!--suppress XmlDuplicatedId -->
      <div id="dm-new-order" v-else>
        <DMItem :actionDetails="actionDetailsWaiting" />
      </div>
    </div>
    <div class="dm-ready-order-wrapper" id="collected">
      <Preloader :msg="_t('Loading new orders') + '...'" v-if="loading" />
      <!--suppress XmlDuplicatedId -->
      <div id="dm-new-order" v-else>
        <DMItem :actionDetails="actionDetailsCollected" />
      </div>
    </div>
    <OrderDetailsPopup />
    <div class="pagination-customer-details" v-if="!loading">
      <paginate
        v-if="params.totalPages"
        :page-count="params.totalPages"
        :page-range="1"
        :margin-pages="1"
        :clickHandler="moreOrder"
        :prev-text="_t('Prev')"
        :next-text="_t('Next')"
        :container-class="paginationDirection"
        :page-class="_t('page-item')"
      >
      </paginate>
    </div>
  </div>
</template>

<script>
/*global $*/
import { mapState, mapActions, mapGetters } from 'vuex'
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'
import paginate from 'vuejs-paginate'
import Preloader from '@/components/util/progressbar'
import DMItem from '@/components/deliveryManager/content/DMItem'
import DMTakeAwaySubMenu from '@/components/deliveryManager/header/DMTakeAwaySubMenu'
export default {
  name: 'TakeAway',
  data() {
    return {
      actionDetailsNew: {
        moreDetails: true,
        action: 'takeaway_ready',
        actionLabel: 'Ready',
        nextOrderStatus: 'paid',
      },
      actionDetailsWaiting: {
        moreDetails: true,
        action: 'takeaway_picked',
        actionLabel: 'Collected',
        nextOrderStatus: 'finished',
      },
      actionDetailsCollected: {
        moreDetails: false,
        action: '',
        actionLabel: '',
        nextOrderStatus: 'finished',
      },
      selectedUser: '',
      paginationDirection: 'holdorders',
      interval: null,
    }
  },
  components: {
    DMTakeAwaySubMenu,
    DMItem,
    // eslint-disable-next-line vue/no-unused-components
    OrderDetailsPopup,
    // eslint-disable-next-line vue/no-unused-components
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
  },
  updated() {
    if (this.listType == this._t('Waiting for Pick')) {
      this.paginationDirection = ''
    } else {
      this.paginationDirection = 'holdorders'
    }
  },
  mounted() {
    this.$store.dispatch('deliveryManager/fetchDMOrderDetail')

    this.interval = setInterval(() => {
      this.$store.dispatch('deliveryManager/fetchDMOrderDetail')
    }, 1000 * 20)
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {
    ...mapActions('order', ['updateOrderAction']),
    showDropdown: function() {
      $('.dropdown-content').show()
    },
    moreOrder: function(pageNumber) {
      this.$store.commit('deliveryManager/SET_DM_PAGE', pageNumber)
      this.$store.dispatch('deliveryManager/fetchDMOrderDetail')
    },
    getSelectUser: function() {
      this.selectedUser = $('#get-customer-list').val()
    },

    ...mapActions('deliveryManager', [
      'selectDriver',
      'restoreOrders',
      'assignBucketToDriver',
    ]),
  },
}
</script>

<style scoped></style>
