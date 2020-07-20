<template>
  <div class="header-main-right color-dashboard-background">
    <div class="user-name">
      <a class>
        <span class>{{ username }}</span>
      </a>
    </div>
    <div class="all-booking-btns hide-below-sm">
      <button
        type
        id="all-tables"
        class="tables-btn-style"
        :class="{ active: dineInTabType === 'all' }"
        @click="
          fetchOrdersWithTableDetails({
            title: 'all',
            pageId: 'getBookedTables',
          })
        "
      >
        {{ _t('Tables') }}
      </button>
      <!--<button
        type
        id="waiting-dinein"
        class="tables-btn-style"
        :class="{ active: dineInTabType === 'waiting' }"
        @click="
          fetchOrdersWithTableDetails({
            title: 'waiting',
            pageId: '',
          })
        "
      >
        {{ _t('Waiting') }}
      </button>-->
      <button
        type
        id="resrvation-orders"
        class="tables-btn-style"
        :class="{ active: dineInTabType === 'reservation' }"
        @click="
          fetchOrdersWithTableDetails({
            title: 'reservation',
            pageId: '',
          })
        "
      >
        {{ _t('Reservation') }}
      </button>
      <button
        type
        id="running-orders"
        class="tables-btn-style"
        :class="{ active: dineInTabType === 'running' }"
        @click="
          fetchOrdersWithTableDetails({
            title: 'running',
            pageId: 'dineInRunningOrders',
          })
        "
      >
        {{ _t('Running Orders') }}
      </button>
      <button
        type
        id="completed-orders"
        class="tables-btn-style"
        :class="{ active: dineInTabType === 'completed' }"
        @click="
          fetchOrdersWithTableDetails({
            title: 'completed',
            pageId: 'dineInCompleteOrders',
          })
        "
      >
        {{ _t('Completed Orders') }}
      </button>
    </div>
    <div class="hide-below-sm">
      <LanguageMenu />
    </div>
    <SwitchStore />
    <TopSidebarMenu />
    <div class="curent-sale hideBigScreen">
      <div id="bkgOverlay" class="backgroundOverlay"></div>
      <div class="all-booking-btns">
        <div class="dine-btn-footer">
          <div class="dine-btn-menu footer-slide-menu" @click="showBookingBtn">
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
          <div class="btn-menu-close footer-slide-menu" @click="dineCloseBtn">
            <i aria-hidden="true" class="fa fa-times"></i>
          </div>
          <div class="dine-btn-footer-wrapper">
            <button
              type
              id="all-tables"
              class="tables-btn-style"
              :class="{ active: dineInTabType === 'all' }"
              @click="
                fetchOrdersWithTableDetails({
                  title: 'all',
                  pageId: 'getBookedTables',
                })
              "
            >
              {{ _t('Tables') }}
            </button>
            <!--<button
              type
              id="waiting-dinein"
              class="tables-btn-style"
              :class="{ active: dineInTabType === 'waiting' }"
              @click="
                fetchOrdersWithTableDetails({
                  title: 'waiting',
                  pageId: '',
                })
              "
            >
              {{ _t('Waiting') }}
            </button>-->
            <button
              type
              id="resrvation-orders"
              class="tables-btn-style"
              :class="{ active: dineInTabType === 'reservation' }"
              @click="
                fetchOrdersWithTableDetails({
                  title: 'reservation',
                  pageId: '',
                })
              "
            >
              {{ _t('Reservation') }}
            </button>
            <button
              type
              id="running-orders"
              class="tables-btn-style"
              :class="{ active: dineInTabType === 'running' }"
              @click="
                fetchOrdersWithTableDetails({
                  title: 'running',
                  pageId: 'dineInRunningOrders',
                })
              "
            >
              {{ _t('Running Orders') }}
            </button>
            <button
              type
              id="completed-orders"
              class="tables-btn-style"
              :class="{ active: dineInTabType === 'completed' }"
              @click="
                fetchOrdersWithTableDetails({
                  title: 'completed',
                  pageId: 'dineInCompleteOrders',
                })
              "
            >
              {{ _t('Completed Orders') }}
            </button>
          </div>
        </div>
        <LanguageMenu />
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters, mapActions } from 'vuex'
import AuthService from '@/services/data/AuthService'
import bootstrap from '@/bootstrap'
import SwitchStore from '@/components/commonButtons/SwitchStore'
import TopSidebarMenu from '@/components/util/TopSidebarMenu'
import LanguageMenu from '@/components/util/LanguageMenu'
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
      iconCodeSelection: 'us',
      onlineOrdersCount: 0,
      dm: this.baseurl('delivery') + '/delivery_home/new',
      dashboard: this.baseurl('dashboard'),
      crm: this.baseurl('crm') + '/brand_customers',
      menu: this.baseurl('menu'),
      brand: this.baseurl('brands'),
    }
  },
  updated() {},
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
    ...mapGetters('auth', ['waiter', 'carhop']),
    ...mapState('location', ['availableLanguages', 'language']),
    ...mapState('dinein', ['dineInTabType', 'activeArea']),
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
    moveDineSection() {
      this.$router.push('/dine-in' + this.store)
      $('.setting-dropdown').css('display', 'none')
    },
    enabledModule(option) {
      switch (option) {
        case 'switchCashier':
          return true
      }
    },
    iconCode: function(iconCode) {
      this.iconCodeSelection = iconCode
    },
    walkOrder() {
      this.$router.push(this.store)
      this.$store.commit('order/ORDER_TYPE', {
        OTview: 'Walk In',
        OTApi: 'walk_in',
      })
    },
    moveTransactionSection() {
      this.$router.push(this.store + '/transactions')
    },
    fetchOrdersWithTableDetails: function(orderStatus) {
      this.$store.commit('dinein/SET_PAGE_NO', 1)
      this.$store
        .dispatch('dinein/updateDineInOrderStatus', orderStatus)
        .then(() => {
          $('#' + this.activeArea._id).click()
        })
      if (orderStatus.title == 'running' || orderStatus.title == 'completed') {
        this.$store.commit('dinein/KITCHEN_PRINT', false)
      } else {
        this.$store.commit('dinein/KITCHEN_PRINT', true)
      }
      $('#bkgOverlay').hide()
      $('.hideBigScreen .dine-btn-footer-wrapper').removeClass('active')
      $('.dine-btn-menu').removeClass('active')
      $('.btn-menu-close ').removeClass('active')
    },
    ...mapActions('auth', ['logout']),
    changeLanguage(locale) {
      // const language = this.languages.find(lang => lang.code === this.vlocale).code
      bootstrap.loadUI(this.$store)
      this.$store.dispatch('location/changeLanguage', locale)
    },
    openConfigLinks() {
      $('#bkgOverlay').toggle()
      //posConfigLinks()
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
        window.location.href.replace(
          new RegExp('/(dine-in|pos)/.*'),
          '/' + link
        ) + this.$store.getters['context/brand']
      )
    },
    showBookingBtn() {
      $('.hideBigScreen .dine-btn-footer-wrapper').addClass('active')
      $('.dine-btn-menu').addClass('active')
      $('.btn-menu-close ').addClass('active')
      $('.dine-in-wrapper').toggleClass('overlay')
      $('#bkgOverlay').fadeIn(400)
    },
    dineCloseBtn() {
      $('.hideBigScreen .dine-btn-footer-wrapper').removeClass('active')
      $('.dine-btn-menu').removeClass('active')
      $('.btn-menu-close ').removeClass('active')
      $('#bkgOverlay').fadeOut()
    },
    logoutCashier() {
      localStorage.setItem('token', '')
      this.$store.commit('auth/SET_TOKEN', '')
      this.$store.commit('auth/LOGOUT_ACTION', 'switchCashier')
      AuthService.logout().then(() => {})
    },
    /*...mapActions('customer', ['fetchCustomerAddress']),*/
  },
  mounted() {
    this.onlineOrders()
  },
}
</script>
<style lang="scss" scoped>
#dropdownLanguage {
  margin-right: 0.39rem;
}
</style>
