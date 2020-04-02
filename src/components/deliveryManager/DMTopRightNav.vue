<template>
  <div class="page-header dm-top-header">
    <div class="header">
      <div class="header-main">
        <div class="header-main-right color-dashboard-background">
          <div class="current-time">
            <div class="header-main-left-time">
              <DateTimeVue />
              <span class="time text-uppercase font-weight-bold">
                {{ todayTime }}
              </span>
            </div>
          </div>
          <div class="button-block">
            <div class="top-menu-container"></div>
          </div>
          <div class="header-content-display">
            <div class="change-location btns-wrapper">
              <button
                class="btn btn-success change-brand-web"
                v-if="allowed(PERMS.BRAND_SETTINGS)"
              >
                <a :href="baseurl('delivery')" target="_self">{{
                  _t('Change Brand')
                }}</a>
              </button>
              <button
                class="btn btn-success walkin-btn"
                @click="
                  orderTypeWalkIn({ OTview: 'Walk In', OTApi: 'walk_in' })
                "
              >
                <router-link :to="store" class="text-white">
                  {{ _t('Walk-in') }}
                </router-link>
              </button>
            </div>
          </div>
          <div class="hideSmallScreen">
            <LanguageMenu />
            <SwitchStore />
            <TopSidebarMenu />
          </div>
          <div class="dm-btn-footer hideBigScreen">
            <!--<div id="bkgOverlay" class="backgroundOverlay"></div>-->
            <div class="dm-footer-wrapper">
              <div class="dm-footer-buttons">
                <div
                  class="dm-btn-menu footer-slide-menu"
                  @click="showBookingBtn"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z"
                      fill="white"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"
                      fill="white"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12Z"
                      fill="white"
                    ></path>
                  </svg>
                </div>
                <div
                  class="btn-menu-close footer-slide-menu"
                  @click="dmCloseBtn"
                >
                  <i aria-hidden="true" class="fa fa-times"></i>
                </div>
                <div class="dm-btn-footer-wrapper">
                  <button
                    class="active btn btn-success"
                    data-related="home-delivery-order"
                    @click="
                      updateOrderStatus({
                        orderStatus: 'in-progress',
                        collected: 'no',
                        pageId: 'home_delivery_new',
                        title: _t('New Orders'),
                        dataRelated: 'dm-new-order',
                        section: 'crm',
                      })
                    "
                  >
                    {{ _t('Home Delivery Orders') }}
                  </button>
                  <button
                    class="btn btn-success"
                    data-related="new-Collections"
                    @click="
                      updateOrderStatus({
                        orderStatus: 'in-progress',
                        collected: 'no',
                        pageId: 'takeaway_new',
                        title: _t('NEW TAKEAWAY ORDERS'),
                        dataRelated: 'new-Collections',
                        section: 'takeaway',
                      })
                    "
                  >
                    {{ _t('Take Away Orders') }}
                  </button>
                  <button
                    class="btn btn-success"
                    data-related="future-order"
                    @click="
                      updateOrderStatus({
                        orderStatus: 'future-order',
                        collected: 'no',
                        pageId: 'future',
                        title: _t('Future Orders'),
                        dataRelated: 'future-order',
                        section: 'future',
                      })
                    "
                  >
                    {{ _t('Future Orders') }}
                  </button>
                </div>
              </div>
              <div class="dm-switch-langage">
                <SwitchStore />
                <LanguageMenu />
                <TopSidebarMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*global deliveryTabs*/
/* eslint-disable no-console  */
/* global $ */
import moment from 'moment-timezone'
import { mapGetters, mapState, mapActions } from 'vuex'
import bootstrap from '@/bootstrap'
import SwitchStore from '@/components/commonButtons/SwitchStore'
import TopSidebarMenu from '@/components/util/TopSidebarMenu'
import LanguageMenu from '@/components/util/LanguageMenu'
import DateTimeVue from '@/components/util/DateTimeVue'

export default {
  name: 'DMTopRightNav',
  components: {
    SwitchStore,
    TopSidebarMenu,
    LanguageMenu,
    DateTimeVue,
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
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['allowed']),
    ...mapState('location', ['availableLanguages', 'language']),
    ...mapGetters('location', ['_t', 'permitted']),
  },
  methods: {
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
    updateOrderStatus(orderStatus) {
      this.$store.commit('deliveryManager/LIST_TYPE', orderStatus.title)
      this.$store.commit('deliveryManager/SECTION', orderStatus.section)
      if (orderStatus.section) {
        this.$store.dispatch('deliveryManager/updateDMOrderStatus', orderStatus)
        deliveryTabs(orderStatus.dataRelated)
      }
      this.dmCloseBtn()
    },
    showBookingBtn() {
      $('.dm-btn-footer-wrapper').addClass('active')
      $('.dm-btn-menu').addClass('active')
      $('.btn-menu-close ').addClass('active')
      $('.dm-in-wrapper').toggleClass('overlay')
      $('#bkgOverlay').fadeIn(400)
    },
    dmCloseBtn() {
      $('.dm-btn-footer-wrapper').removeClass('active')
      $('.dm-btn-menu').removeClass('active')
      $('.btn-menu-close ').removeClass('active')
      $('#bkgOverlay').fadeOut()
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
@import '@/assets/scss/header';
.header-main-left-time {
  margin-right: 10px;
  span {
    font-size: $px16;
    display: block;
    font-weight: bold;
  }
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
</style>
