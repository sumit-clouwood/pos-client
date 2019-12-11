<template>
  <div class="page-header">
    <div class="current-time">
      <div class="header-main-left-time">
        <span>{{ todayDate }} </span>
        <span class="time text-uppercase font-weight-bold">
          {{ todayTime }}
        </span>
      </div>
    </div>
    <div class="button-block">
      <div class="top-menu-container">
        <div class="top-menu-icon" @click="showLeftMenu()">
          <svg id="nav_menu_icon" viewBox="0 0 140 140">
            <path
              class="fil0"
              d="M15.5 1c8.01,0 14.5,6.49 14.5,14.5 0,8.01 -6.49,14.5 -14.5,14.5 -8.01,0 -14.5,-6.49 -14.5,-14.5 0,-8.01 6.49,-14.5 14.5,-14.5zm109 0c8.01,0 14.5,6.49 14.5,14.5 0,8.01 -6.49,14.5 -14.5,14.5 -8.01,0 -14.5,-6.49 -14.5,-14.5 0,-8.01 6.49,-14.5 14.5,-14.5zm0 109c8.01,0 14.5,6.49 14.5,14.5 0,8.01 -6.49,14.5 -14.5,14.5 -8.01,0 -14.5,-6.49 -14.5,-14.5 0,-8.01 6.49,-14.5 14.5,-14.5zm-109 0c8.01,0 14.5,6.49 14.5,14.5 0,8.01 -6.49,14.5 -14.5,14.5 -8.01,0 -14.5,-6.49 -14.5,-14.5 0,-8.01 6.49,-14.5 14.5,-14.5zm54 -109c8.01,0 14.5,6.49 14.5,14.5 0,8.01 -6.49,14.5 -14.5,14.5 -8.01,0 -14.5,-6.49 -14.5,-14.5 0,-8.01 6.49,-14.5 14.5,-14.5zm0 109c8.01,0 14.5,6.49 14.5,14.5 0,8.01 -6.49,14.5 -14.5,14.5 -8.01,0 -14.5,-6.49 -14.5,-14.5 0,-8.01 6.49,-14.5 14.5,-14.5zm0 -55c8.01,0 14.5,6.49 14.5,14.5 0,8.01 -6.49,14.5 -14.5,14.5 -8.01,0 -14.5,-6.49 -14.5,-14.5 0,-8.01 6.49,-14.5 14.5,-14.5zm-54 0c8.01,0 14.5,6.49 14.5,14.5 0,8.01 -6.49,14.5 -14.5,14.5 -8.01,0 -14.5,-6.49 -14.5,-14.5 0,-8.01 6.49,-14.5 14.5,-14.5zm108.84 -0.44c8.01,0 14.5,6.49 14.5,14.5 0,8.01 -6.49,14.5 -14.5,14.5 -8,0 -14.5,-6.49 -14.5,-14.5 0,-8.01 6.5,-14.5 14.5,-14.5z"
            ></path>
          </svg>
        </div>
      </div>
      <div class="change-location">
        <button
          class="btn btn-success"
          v-if="isPermitted(PERMISSIONS.BRANDS_BRAND_SETTINGS)"
        >
          <a :href="baseurl('delivery')">{{ _t('Change Brand') }}</a>
        </button>
        <button
          class="btn btn-success walkin-btn"
          @click="orderTypeWalkIn({ OTview: 'Walk In', OTApi: 'walk_in' })"
        >
          <router-link :to="store" class="text-white">
            {{ _t('Walk-in') }}
          </router-link>
        </button>
      </div>
      <button
        class="v-btn v-btn--icon theme--light dropdown-toggle lang-flag-container"
        type="button"
        id="dropdownLanguage"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <img :src="'/img/flag_icon/4x3/' + iconCodeSelection + '.svg'" />
      </button>
      <div
        aria-labelledby="dropdownLanguage"
        class="dropdown-menu cursor-pointer"
        v-if="availableLanguages"
        @change="changeLanguage(vlocale)"
      >
        <a
          class="dropdown-item"
          role="button"
          v-for="language in availableLanguages"
          :key="language._id"
          :value="language.code"
          @click="iconCode(language.icon_code)"
        >
          <span>
            <img :src="'/img/flag_icon/4x3/' + language.icon_code + '.svg'" />
          </span>
          {{ language.name }}
        </a>
      </div>
    </div>
    <div
      class="header header-main header-main-right color-dashboard-background"
    >
      <ul>
        <li
          class="nav-icon nav-item setting-icon color-main color-text-invert"
          id="setting-icon"
          @click="openConfigLinks()"
        >
          <a class="nav-link color-text-invert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21.88"
              height="19.94"
              viewBox="0 0 24 21"
            >
              <path
                fill="#FFF"
                fill-rule="nonzero"
                d="M0 0h24v3H0V0zm0 9h24v3H0V9zm0 9h24v3H0v-3z"
              />
            </svg>
          </a>
          <ul class="setting-dropdown" style="display:none">
            <li v-if="!isWaiter() && !isCarhop()">
              <a role="button">{{ _t('Printers') }}</a>
            </li>
            <li
              v-if="
                !isWaiter() && !isCarhop() && permitted('dashboard', 'root')
              "
            >
              <a :href="dashboard">{{ _t('Dashboard') }}</a>
            </li>
            <li
              v-if="
                !isWaiter() && !isCarhop() && permitted('transactional_orders')
              "
              @click="moveTransactionSection(this)"
            >
              <a role="button">
                {{ _t('Transactions') }}
              </a>
            </li>
            <li v-if="!isWaiter() && !isCarhop() && permitted('crm', 'root')">
              <a :href="crm">{{ _t('CRM') }}</a>
            </li>
            <li v-if="!isCarhop()" @click="moveDineSection()">
              <a role="button">
                {{ _t('Dine In') }}
              </a>
            </li>
            <li v-if="!isWaiter() && !isCarhop() && permitted('menu', 'root')">
              <a :href="menu">{{ _t('Menu Setup') }}</a>
            </li>
            <li
              v-if="!isWaiter() && !isCarhop() && permitted('delivery', 'root')"
            >
              <router-link
                :to="'/delivery-manager' + store"
                role="button"
                @click="setDeliveryManageState()"
              >
                {{ _t('Delivery Manager') }}
              </router-link>
            </li>
            <li v-if="!isWaiter() && !isCarhop()">
              <router-link
                :to="'/' + store"
                role="button"
                class="cursor-pointer"
              >
                {{ _t('Walk-In') }}
              </router-link>
            </li>
            <li v-if="!isWaiter()">
              <router-link :to="'/carhop' + store">
                {{ _t('Carhop') }}
              </router-link>
            </li>
            <li v-if="!isWaiter()">
              <router-link :to="'/carhop-orders' + store">
                {{ _t('Carhop Orders') }}
              </router-link>
            </li>
            <li v-if="!isWaiter() && !isCarhop() && permitted('brand', 'root')">
              <a :href="brand">{{ _t('Settings') }}</a>
            </li>
            <li
              v-if="
                enabledModule('switchCashier') && !isWaiter() && !isCarhop()
              "
            >
              <router-link
                :to="'/cashier-login' + store"
                @click.native="logoutCashier"
              >
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
  </div>
</template>
<script>
/* eslint-disable no-console  */
/* global $ */
import moment from 'moment-timezone'
import { mapGetters, mapState, mapActions } from 'vuex'
import bootstrap from '@/bootstrap'
export default {
  name: 'DMTopRightNav',
  data() {
    return {
      todayDate: moment().format('MMMM Do YYYY'),
      todayTime: moment().format('h:mm:ss a'),
      iconCodeSelection: 'us',
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
    ...mapGetters('context', ['store']),
    ...mapState('location', ['availableLanguages', 'language']),
    ...mapGetters('location', ['_t', 'permitted']),
  },
  methods: {
    openConfigLinks() {
      $('.setting-dropdown').show()
      $('.setting-dropdown').addClass('animated zoomIn')
    },
    enabledModule(option) {
      switch (option) {
        case 'switchCashier':
          return true
      }
    },
    moveDineSection() {
      this.$router.push('/dine-in' + this.store)
      $('.setting-dropdown').css('display', 'none')
    },
    moveTransactionSection() {
      this.$router.push(this.store + '/transactions')
    },
    orderTypeWalkIn: function(orderType) {
      this.$store.commit('order/ORDER_TYPE', orderType)
      this.$store.commit('location/SET_MODAL', '#manage-customer')
      this.$store.dispatch('customer/resetCustomer')
    },
    iconCode: function(iconCode) {
      this.iconCodeSelection = iconCode
    },
    changeLanguage(locale) {
      bootstrap.loadUI(this.$store)
      this.$store.dispatch('location/changeLanguage', locale)
    },
    baseurl(link) {
      return window.location.href.replace(
        new RegExp('/pos/delivery-manager/.*'),
        '/' + link
      )
    },
    showLeftMenu() {
      let navigation = $('.navigation')
      navigation.toggleClass('active')
      navigation.css('left', '-999px')
      $('.navigation.active').css('left', 0)
    },
    ...mapActions('auth', ['logout']),
  },
  mounted: function() {
    $('.setting-dropdown').hide()
    setInterval(() => {
      this.todayTime = moment().format('h:mm:ss a')
    }, 1000)
  },
}
</script>

<style lang="scss" scoped>
.header-main-left-time {
  width: 250px;
}
.button-block {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
.change-location {
  margin-left: 14px;
}
.page-header {
  display: flex;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}
.header-main {
  height: 3.3125rem;
  display: grid;
  grid-template-columns: auto auto;
}
.nav-icon {
  position: relative;
}
.nav-link {
  background-color: #5056ca;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 3px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  padding: 0.25px;
  justify-content: center;
}
.setting-dropdown {
  display: none;
  background: rgb(255, 255, 255);
  font-weight: 600;
  position: absolute;
  top: 3.375rem;
  right: 0px;
  width: 13.1875rem;
  display: none;
  background: #fff;
  font-weight: 607px;
  position: absolute;
  top: 3.375rem;
  right: 0;
  width: 13.1875rem;
  -webkit-box-shadow: 0 0px 0.0625rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.375rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.75rem 0 rgba(23, 23, 32, 0.05);
  box-shadow: 12 0px 0.0625rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.1875rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.375rem 0 rgba(23, 23, 32, 0.05),
    0 0px 0.75rem 0 rgba(23, 23, 32, 0.05);
  border: 1px solid #eee;
  border-radius: 3px;
  background-color: #fff;
  color: #000;
  z-index: 10;
  font-size: 55rem;
  li {
    padding: 0 !important;
    text-decoration: none;
    a {
      display: block;
      width: 100%;
      font-size: 1.125rem;
      color: #555;
      font-weight: 400;
      display: block;
      width: 100%;
      padding: 5px 20px;
      cursor: pointer;
    }
  }
  li:hover,
  a:hover {
    background: #e3e7f2;
    background-color: grey;
    color: #555555;
  }
  a:hover {
    background: #f1f1f1;
  }
}
</style>
