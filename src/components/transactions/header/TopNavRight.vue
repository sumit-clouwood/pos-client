<template>
  <div class="header-main-right color-dashboard-background">
    <div class="user-name">
      <a class="">
        <span class="">{{ username }}</span>
      </a>
    </div>
    <div class="online color-text-invert">
      <div class="fa fa-fw fa-circle" :class="{ online: online }"></div>
      <div v-if="online">{{ _t('Online') }}</div>
      <div v-else>{{ _t('Offline') }}</div>
    </div>
    <ul class="online-counter color-main">
      <li
        class="nav-item online-data "
        data-toggle="modal"
        data-target="#online-order"
      >
        <a class="btn-part color-text-invert" href="javascript:void(0)">
          {{ _t('Online') }}
          <span class="online-digit color-secondary">{{
            onlineOrders.count
          }}</span>
        </a>
      </li>
    </ul>
    <div class="walkin-btn-design">
      <button
        class="btn btn-success walkin-btn"
        @click="orderTypeWalkIn({ OTview: 'Walk In', OTApi: 'walk_in' })"
      >
        <router-link :to="store" class="text-white">
          {{ _t('Walk-in') }}
        </router-link>
      </button>
    </div>
    <LanguageMenu />
    <SwitchStore />
    <TopSidebarMenu />
    <OnlineOrder />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import bootstrap from '@/bootstrap'
import SwitchStore from '@/components/commonButtons/SwitchStore'
import TopSidebarMenu from '@/components/util/TopSidebarMenu'
import LanguageMenu from '@/components/util/LanguageMenu'
import OnlineOrder from '@/components/pos/header/popups/OnlineOrder'
export default {
  name: 'TopNavRight',
  components: {
    OnlineOrder,
    SwitchStore,
    TopSidebarMenu,
    LanguageMenu,
  },
  props: {},
  data: function() {
    return {
      onlineOrdersCount: 0,
      dm: this.baseurl('delivery') + '/delivery_home/new',
      dashboard: this.baseurl('dashboard'),
      crm: this.baseurl('crm') + '/brand_customers',
      menu: this.baseurl('menu'),
      brand: this.baseurl('brands'),
    }
  },
  computed: {
    vlocale: {
      get() {
        return this.$store.state.location.locale
      },
      set(val) {
        return this.$store.commit('location/SET_LOCALE', val)
      },
    },
    ...mapGetters('context', ['store', 'haveMultipleStores']),
    ...mapState('location', ['availableLanguages', 'language']),
    ...mapGetters('deliveryManager', ['onlineOrders']),
    ...mapState('sync', ['online']),
    ...mapState({
      latestOnlineOrders: state =>
        state.order.onlineOrders ? state.order.onlineOrders.length : 0,
      username: state =>
        state.auth.userDetails ? state.auth.userDetails.name : '',
    }),
    ...mapGetters('location', ['_t', 'permitted']),
  },
  methods: {
    enabledModule(option) {
      switch (option) {
        case 'switchCashier':
          return true
      }
    },
    moveTransactionSection() {
      this.$router.push(this.store + '/transactions')
    },
    moveDineSection() {
      this.$router.push('/dine-in' + this.store)
    },
    orderTypeWalkIn: function(orderType) {
      this.$store.commit('order/ORDER_TYPE', orderType)
      this.$store.commit('location/SET_MODAL', '#manage-customer')
      this.$store.dispatch('customer/resetCustomer')
    },
    ...mapActions('auth', ['logout']),
    changeLanguage(locale) {
      // const language = this.languages.find(lang => lang.code === this.vlocale).code
      bootstrap.loadUI(this.$store)
      this.$store.dispatch('location/changeLanguage', locale)
    },
    onlineOrders() {
      if (this.latestOnlineOrders === 0) {
        if (
          localStorage.getItem('onlineOrders') != 'undefined' &&
          JSON.parse(localStorage.getItem('onlineOrders')) != null
        ) {
          this.onlineOrdersCount = JSON.parse(
            localStorage.getItem('onlineOrders')
          ).length
        } else {
          this.onlineOrdersCount = 0
        }
      } else {
        this.onlineOrdersCount = this.latestOnlineOrders
      }
    },
    baseurl(link) {
      return (
        window.location.href.replace(new RegExp('/pos/.*'), '/' + link) +
        this.$store.getters['context/brand']
      )
    },
    /*...mapActions('customer', ['fetchCustomerAddress']),*/
  },
  mounted() {
    this.onlineOrders()
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
@include responsive(mobile) {
  .transaction-orders .header .header-main .header-main-right {
    .user-name,
    .online,
    .online-counter {
      display: none;
    }
  }
}
</style>
