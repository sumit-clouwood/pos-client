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
    <ul>
      <li v-if="availableLanguages" class="color-text-invert">
        <select
          v-model="vlocale"
          @change="changeLanguage(vlocale)"
          class="language-button"
        >
          <option
            v-for="language in availableLanguages"
            :key="language._id"
            :value="language.code"
          >
            {{ language.name }}
          </option>
        </select>
      </li>
    </ul>
    <ul class="online-counter color-main">
      <li
        class="nav-item online-data "
        data-toggle="modal"
        data-target="#online-order"
      >
        <a class="btn-part color-text-invert" role="button">
          {{ _t('Online') }}
          <span class="online-digit color-secondary">2</span>
        </a>
      </li>
    </ul>
    <div class="curent-sale hideBigScreen">
      <div class="curent-sale-title">{{ _t('Current Sale') }}</div>
      <div class="curent-sale-item">
        <div class="text">Item</div>
        <div class="num">x3</div>
      </div>
    </div>
    <ul>
      <li
        class="nav-icon nav-item setting-icon color-main color-text-invert"
        id="setting-icon"
        @click="openConfigLinks()"
      >
        <a class="nav-link color-text-invert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="21"
            viewBox="0 0 24 21"
          >
            <path
              fill="#FFF"
              fill-rule="nonzero"
              d="M0 0h24v3H0V0zm0 9h24v3H0V9zm0 9h24v3H0v-3z"
            />
          </svg>
        </a>
        <ul class="setting-dropdown">
          <li v-if="enabled('printers')">
            <a role="button">{{ _t('Printers') }}</a>
          </li>
          <li v-if="enabled('dashboard') && permitted('dashboard', 'root')">
            <a :href="dashboard">{{ _t('Dashboard') }}</a>
          </li>
          <li
            v-if="enabled('transactions') && permitted('transactional_orders')"
            @click="moveTransactionSection(this)"
          >
            <a role="button">
              {{ _t('Transactions') }}
            </a>
          </li>
          <li v-if="enabled('crm') && permitted('crm', 'root')">
            <a :href="crm">{{ _t('CRM') }}</a>
          </li>
          <li v-if="enabled('dinein')" @click="moveDineSection()">
            <a role="button">
              {{ _t('Dine In') }}
            </a>
          </li>
          <li v-if="enabled('menusetup') && permitted('menu', 'root')">
            <a :href="menu">{{ _t('Menu Setup') }}</a>
          </li>
          <li v-if="enabled('delivery') && permitted('delivery', 'root')">
            <router-link
              :to="'/delivery-manager' + store"
              role="button"
              @click="setDeliveryManageState()"
            >
              {{ _t('Delivery Manager') }}
            </router-link>
          </li>
          <li v-if="enabled('walkin')">
            <router-link :to="'/' + store" role="button" class="cursor-pointer">
              {{ _t('Walk-In') }}
            </router-link>
          </li>
          <li v-if="enabled('carhop')">
            <router-link :to="'/carhop' + store">
              {{ _t('Carhop') }}
            </router-link>
          </li>
          <li v-if="enabled('carhoporders')">
            <router-link :to="'/carhop-orders' + store">
              {{ _t('Carhop Orders') }}
            </router-link>
          </li>
          <li v-if="enabled('brand') && permitted('brand', 'root')">
            <a :href="brand">{{ _t('Settings') }}</a>
          </li>
          <li v-if="enabledModule('switchCashier') && enabled('switchcashier')">
            <router-link :to="'/cashier-login' + store">
              {{ _t('Switch Cashier') }}
            </router-link>
          </li>
          <li>
            <a role="button" @click="logout()">{{ _t('Logout') }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
/*global $ */
import { mapState, mapGetters, mapActions } from 'vuex'
import * as CONST from '@/constants'

import bootstrap from '@/bootstrap'
export default {
  name: 'TopNavRight',
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
  watch: {},
  computed: {
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
    ...mapState('location', ['availableLanguages', 'language']),
    ...mapState('sync', ['online']),
    ...mapState('order', ['orderType']),
    ...mapState({
      latestOnlineOrders: state =>
        state.order.onlineOrders ? state.order.onlineOrders.length : 0,
      username: state =>
        state.auth.userDetails ? state.auth.userDetails.name : '',
    }),
    ...mapGetters('location', ['_t', 'permitted']),
  },
  methods: {
    enabled(option) {
      switch (option) {
        case 'printers':
          if (this.waiter || this.carhop) {
            return false
          }
          return true
        case 'dashboard':
          if (this.waiter || this.carhop) {
            return false
          }
          return true
        case 'transactions':
          if (this.waiter || this.carhop) {
            return false
          }
          return true
        case 'crm':
          if (this.waiter || this.carhop) {
            return false
          }
          return true
        case 'dinein':
          if (this.carhop) {
            return false
          }
          return true
        case 'menusetup':
          if (this.waiter || this.carhop) {
            return false
          }
          return true
        case 'delivery':
          if (this.waiter || this.carhop) {
            return false
          }
          return true
        case 'walkin':
          if (this.waiter || this.carhop) {
            return false
          }
          return true
        case 'carhop':
          if (this.waiter) {
            return false
          }
          return true
        case 'carhoporders':
          if (this.waiter) {
            return false
          }
          return true
        case 'brand':
          if (this.waiter || this.carhop) {
            return false
          }
          return true
        case 'switchCashier':
          if (this.waiter || this.carhop) {
            return true
          }
          return true
        default:
          return true
      }
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
    openConfigLinks() {
      /*if ($('.setting-dropdown:visible').length > 0) {
        // $('.setting-dropdown').hide()
        let icons = $('.setting-dropdown, .setting-dropdown-transaction')
        icons.hide(500)
        $('body').removeClass('active-body')
      } else {
        $('.setting-dropdown').show()
        $('.setting-dropdown').addClass('animated zoomIn')
      }*/
      $('.setting-dropdown').show()
      $('.setting-dropdown').addClass('animated zoomIn')
      // posConfigLinks()
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
    /*dineInUrl(link) {
      return window.location.href.replace(new RegExp('/dine-in/.*'), '/' + link)
    },*/
    /*...mapActions('customer', ['fetchCustomerAddress']),*/
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
  },
}
</script>
<style lang="scss" scoped>
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
</style>
