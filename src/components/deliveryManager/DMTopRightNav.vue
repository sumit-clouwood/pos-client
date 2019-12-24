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
    <SwitchStore />
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
          v-if="isPermitted(PERMISSIONS.BRAND_SETTINGS)"
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
    <div class="header">
      <div class="header-main">
        <div class="header-main-right color-dashboard-background">
          <ul>
            <TopSidebarMenu />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-console  */
/* global $ */
import moment from 'moment-timezone'
import { mapGetters, mapState, mapActions } from 'vuex'
import bootstrap from '@/bootstrap'
import SwitchStore from '@/components/commonButtons/SwitchStore'
import TopSidebarMenu from '@/components/util/TopSidebarMenu'

export default {
  name: 'DMTopRightNav',
  components: {
    SwitchStore,
    TopSidebarMenu,
  },
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
@import '../../assets/scss/header';
.header-main-left-time {
  width: 250px;
  span {
    font-size: 17px;
    display: block;
    font-weight: bold;
  }
}
.button-block {
  display: flex;
  justify-content: flex-end;
  width: 100%;
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
  height: 44px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  -webkit-box-pack: center;
  padding: 0.25px;
}
.setting-dropdown {
  display: none;
  position: absolute;
  top: 3.375rem;
  width: 13.1875rem;
  background: #fff;
  right: 0;
  border: 1px solid #eee;
  border-radius: 3px;
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
      padding: 5px 20px;
      cursor: pointer;
    }
  }
  li:hover,
  a:hover {
    color: #555555;
  }
  a:hover {
    background: #f1f1f1;
  }
}
</style>
