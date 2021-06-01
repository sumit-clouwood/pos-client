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
    <ul class="online-counter color-main" @click="showOnlineOrders()">
      <li
        class="nav-item online-data "
        data-toggle="modal"
        data-target="#online-order"
      >
        <a class="btn-part color-text-invert" role="button">
          {{ _t('Online') }}
          <span class="online-digit color-secondary">{{
            onlineOrders.count
          }}</span>
        </a>
      </li>
    </ul>
    <LanguageMenu />
    <carhop-notification
      v-show="orderType.OTApi === 'carhop'"
    ></carhop-notification>
    <SwitchStore />
    <OnlineOrder />
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
import SwitchStore from '@/components/commonButtons/SwitchStore'
import TopSidebarMenu from '@/components/util/TopSidebarMenu'
import LanguageMenu from '@/components/util/LanguageMenu'

import bootstrap from '@/bootstrap'
import OnlineOrder from './popups/OnlineOrder'
import CarhopNotification from '@/components/util/notification/CarhopNotification'
export default {
  name: 'TopNavRight',
  props: {},
  components: {
    CarhopNotification,
    OnlineOrder,
    SwitchStore,
    TopSidebarMenu,
    LanguageMenu,
  },
  data: function() {
    return {
      dm: this.baseurl('delivery') + '/delivery_home/new',
      dashboard: this.baseurl('dashboard'),
      crm: this.baseurl('crm') + '/brand_customers',
      menu: this.baseurl('menu'),
      brand: this.baseurl('brands'),
    }
  },
  watch: {},
  computed: {
    ...mapGetters('deliveryManager', ['onlineOrders', 'drivers', 'params']),
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
      username: state =>
        state.auth.userDetails ? state.auth.userDetails.name : '',
    }),
    ...mapGetters('location', ['_t', 'permitted']),
    privateContext() {
      return this.$store.state.auth.token
    },
  },
  methods: {
    showOnlineOrders() {
      if (this.privateContext)
        $('#online-order')
          .dialog()
          .dialog('open')
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
    baseurl(link) {
      return (
        window.location.href.replace(new RegExp('/pos/.*'), '/' + link) +
        this.$store.getters['context/brand']
      )
    },
    ...mapGetters('order', ['getLatestOnlineOrders']),
  },
  mounted() {
    if (this.$route.name.match('Carhop')) {
      this.$store.commit('order/ORDER_TYPE', {
        OTview: 'Carhop',
        OTApi: CONST.ORDER_TYPE_CARHOP,
      })
    } else {
      $('.setting-dropdown').hide()
    }
  },
  beforeMount() {
    this.$store.dispatch('deliveryManager/getOnlineOrders')
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
    #dropdownNotifications {
      display: none !important;
    }
  }
}
</style>
