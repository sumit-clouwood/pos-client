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
        <a class="btn-part color-text-invert" role="button">
          {{ _t('Online') }}
          <span class="online-digit color-secondary">{{ orders.length }}</span>
        </a>
      </li>
    </ul>
    <LanguageMenu />
    <SwitchStore />
    <div class="curent-sale hideBigScreen">
      <div class="curent-sale-title">{{ _t('Current Sale') }}</div>
      <div class="curent-sale-item">
        <div class="text">Item</div>
        <div class="num">x3</div>
      </div>
    </div>
    <ul>
      <TopSidebarMenu />
    </ul>
  </div>
</template>

<script>
/*global $ */
import { mapState, mapGetters, mapActions } from 'vuex'
import * as CONST from '@/constants'
import AuthService from '@/services/data/AuthService'
import SwitchStore from '@/components/commonButtons/SwitchStore'
import TopSidebarMenu from '@/components/util/TopSidebarMenu'
import LanguageMenu from '@/components/util/LanguageMenu'
import DMService from '@/services/data/DeliveryManagerService'

import bootstrap from '@/bootstrap'
// var debouncedGetData = utils.debounce(function() {
//   // eslint-disable-next-line no-console
//   DMService.getDMOrderDetails(...params)
//         .then(response => {
//           commit(mutation.SET_LOADING, true)
//           if (response.data) {
//             commit(mutation.SET_DM_ORDERS, response.data)
//             commit(mutation.SET_TOTAL_ORDER, response.data.count)
//             commit(mutation.SET_LOADING, false)
//             /*if (section === 'delivery_home') {*/
//             dispatch('getDrivers')
//             // }
//           }
//         })
//         .catch(() => {
//           commit(mutation.SET_LOADING, false)
//         })
//   if (orders.length) {

//   } 
// else {
//             // component.onlineOrders = [];
//             // component.pauseSound();
//             // component.hideNotification();
//         }
//   }, 500);
var audio = new Audio('/sound/doorbell.ogg');
var nopromise = {
  catch: new Function(),
}
audio.load()
audio.addEventListener(
  'ended',
  function() {
    this.currentTime = 0;
    this.load()(this.play() || nopromise).catch(function() {})
  },
  false
)
export default {
  name: 'TopNavRight',
  props: {},
  components: {
    SwitchStore,
    TopSidebarMenu,
    LanguageMenu,
  },
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
  watch: {},
  computed: {
    ...mapGetters('deliveryManager', ['orders', 'drivers','params']),
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['waiter', 'carhop']),

    vlocale: {
      get() {
        return this.$store.state.location.locale
      },
      set(val) {
        return this.$store.commit('location/SET_LOCALE', val)
      },
    },
    ...mapGetters('context', ['store', 'transactions']),
    ...mapState('location', ['availableLanguages', 'language', 'store']),
    ...mapState('sync', ['online']),
    ...mapState('order', ['orderType']),
    ...mapState({
      latestOnlineOrders: state =>
        state.order.onlineOrders ? state.order.onlineOrders.length : 0,
      username: state =>
        state.auth.userDetails ? state.auth.userDetails.name : '',
    }),
    ...mapState('context'),
    ...mapGetters('location', ['_t', 'permitted']),
    ...mapGetters('deliveryManager', ['orders', 'drivers']),
  },
  methods: {
    logoutCashier() {
      localStorage.setItem('token', '')
      this.$store.commit('auth/SET_TOKEN', '')
      this.$store.commit('auth/LOGOUT_ACTION', 'switchCashier')
      //this.$router.push({ path: '/cashier-login/' + this.storeUrl })
      AuthService.logout().then(() => {})
    },
    enabledModule(option) {
      switch (option) {
        case 'switchCashier':
          return true
      }
    },
    ...mapActions('auth', ['logout']),
    moveDineSection() {
      this.$router.push('/dine-in' + this.store)
      $('.setting-dropdown').css('display', 'none')
    },
    setDeliveryManageState() {
      let orderStatus = {
        orderStatus: 'in-progress',
        collected: 'no',
        pageId: 'home_delivery_new',
        title: 'New Orders',
        dataRelated: 'dm-new-order',
        section: 'crm',
      }
      this.$store.commit('deliveryManager/LIST_TYPE', orderStatus.title)
      this.$store.commit('deliveryManager/SECTION', orderStatus.section)
      this.$store.dispatch('deliveryManager/updateDMOrderStatus', orderStatus)
    },
    moveTransactionSection() {
      this.$router.push(this.store + '/transactions')
    },
    changeLanguage(locale) {
      // const language = this.languages.find(lang => lang.code === this.vlocale).code
      bootstrap.loadUI(this.$store)
      this.$store.dispatch('location/changeLanguage', locale)
    },

    onlineOrders() {
      if (this.latestOnlineOrders == 0) {
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
    getData() {
      DMService.getDMOrderDetails([
        '',
        50,
        'orderBy',
        'real_created_datetime',
        'home_delivery_acceptance',
        this.store._id,
      ])
        .then(response => {
          // eslint-disable-next-line no-console
          console.log('reachingsssss')
          // eslint-disable-next-line no-console
          console.log(response)
          // commit(mutation.SET_LOADING, true)
          // if (response.data) {
          //   commit(mutation.SET_DM_ORDERS, response.data)
          //   commit(mutation.SET_TOTAL_ORDER, response.data.count)
          //   commit(mutation.SET_LOADING, false)
          //   /*if (section === 'delivery_home') {*/
          //   dispatch('getDrivers')
          //   // }
          // }
        })
        .catch(() => {
          commit(mutation.SET_LOADING, false)
        })

    },
    /*dineInUrl(link) {
      return window.location.href.replace(new RegExp('/dine-in/.*'), '/' + link)
    },*/
    /*...mapActions('customer', ['fetchCustomerAddress']),*/
    // playSound() {
    //   (audio.play() || nopromise).catch(function(){});
    // },
    // pauseSound() {
    //   (audio.pause() || nopromise).catch(function(){});
    // },
    ...mapGetters('order', ['getLatestOnlineOrders']),
  },
  mounted() {
    if (this.$route.name.match('Carhop')) {
      this.$store.commit('order/ORDER_TYPE', {
        OTview: 'Carhop',
        OTApi: CONST.ORDER_TYPE_CARHOP,
      })
    } else {
      this.onlineOrders()
      $('.setting-dropdown').hide()
    }
    this.$store.dispatch('deliveryManager/fetchDMOrderDetail', true)
  },
  created() {
    // eslint-disable-next-line no-console
    console.log('reaching')
    this.$socket.$subscribe('online-order-channel', payload => {
      if (payload.data.store_id == this.store._id) {
        this.getData()
      }
      // if (this.waitingForAcceptance && payload.data.brand_id == this.currentBrandId) {
      //     if (this.currentStore) {
      //         if (payload.data.store_id == this.currentStoreId)
      //             this.getData(payload.data.action_id);
      //     } else {
      //         this.getData(payload.data.action_id);
      //     }
      // }
    })
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.setting-dropdown {
  li {
    padding: 0 !important;
    a {
      display: block;
      width: 100%;
      padding: 5px 20px;
    }
  }
}
@include responsive(mobile) {
  .header-main-right {
    .user-name,
    .online,
    .online-counter,
    .curent-sale,
    .menu-language,
    .switch-store,
    #dropdownLanguage {
      display: none !important;
    }
  }
}
</style>
