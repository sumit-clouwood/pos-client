<template>
  <div class="header-main-right color-dashboard-background">
    <div class="user-name">
      <a class="">
        <span class="">{{ username }}</span>
      </a>
    </div>
    <div class="all-booking-btns hide-below-sm">
      <button
        type=""
        id="all-tables"
        class="tables-btn-style"
        :class="{ active: dineInTabType === 'all' }"
        @click="
          updateDineInOrderStatus({
            title: 'all',
            pageId: 'getBookedTables',
          })
        "
      >
        {{ _t('All Tables') }}
      </button>
      <button
        type=""
        id="waiting-dinein"
        class="tables-btn-style"
        :class="{ active: dineInTabType === 'waiting' }"
        @click="
          updateDineInOrderStatus({
            title: 'waiting',
            pageId: '',
          })
        "
      >
        {{ _t('Waiting') }}
      </button>
      <button
        type=""
        id="resrvation-orders"
        class="tables-btn-style"
        :class="{ active: dineInTabType === 'reservation' }"
        @click="
          updateDineInOrderStatus({
            title: 'reservation',
            pageId: '',
          })
        "
      >
        {{ _t('Reservation') }}
      </button>
      <button
        type=""
        id="running-orders"
        class="tables-btn-style"
        :class="{ active: dineInTabType === 'running' }"
        @click="
          updateDineInOrderStatus({
            title: 'running',
            pageId: 'dineInRunningOrders',
          })
        "
      >
        {{ _t('Running Orders') }}
      </button>
      <button
        type=""
        id="completed-orders"
        class="tables-btn-style"
        :class="{ active: dineInTabType === 'completed' }"
        @click="
          updateDineInOrderStatus({
            title: 'completed',
            pageId: 'dineInCompleteOrders',
          })
        "
      >
        {{ _t('Completed Orders') }}
      </button>
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
        <li>
          <a role="button" class="cursor-pointer">{{ _t('Printers') }}</a>
        </li>
        <li v-if="permitted('dashboard', 'root')">
          <a :href="dashboard">{{ _t('Dashboard') }}</a>
        </li>
        <li v-if="permitted('crm', 'root')">
          <a :href="crm">{{ _t('CRM') }}</a>
        </li>
        <li v-if="permitted('menu', 'root')">
          <a :href="menu">{{ _t('Menu Setup') }}</a>
        </li>
        <li v-if="permitted('delivery', 'root')">
          <a role="button" class="cursor-pointer">
            <router-link :to="'/delivery-manager' + store">
              {{ _t('Delivery Manager') }}
            </router-link>
          </a>
        </li>
        <li v-if="permitted('brand', 'root')">
          <a :href="brand">{{ _t('Settings') }}</a>
        </li>
        <li>
          <a role="button" class="cursor-pointer" @click="logout()">{{
            _t('Logout')
          }}</a>
        </li>
      </ul>
    </li>
    <div class="curent-sale hideBigScreen">
      <div class="all-booking-btns">
        <button
          type=""
          id="all-tables"
          class="tables-btn-style"
          :class="{ active: dineInTabType === 'all' }"
          @click="
            updateDineInOrderStatus({
              title: 'all',
              pageId: 'getBookedTables',
            })
          "
        >
          {{ _t('All Tables') }}
        </button>
        <button
          type=""
          id="waiting-dinein"
          class="tables-btn-style"
          :class="{ active: dineInTabType === 'waiting' }"
          @click="
            updateDineInOrderStatus({
              title: 'waiting',
              pageId: '',
            })
          "
        >
          {{ _t('Waiting') }}
        </button>
        <button
          type=""
          id="resrvation-orders"
          class="tables-btn-style"
          :class="{ active: dineInTabType === 'reservation' }"
          @click="
            updateDineInOrderStatus({
              title: 'reservation',
              pageId: '',
            })
          "
        >
          {{ _t('Reservation') }}
        </button>
        <button
          type=""
          id="running-orders"
          class="tables-btn-style"
          :class="{ active: dineInTabType === 'running' }"
          @click="
            updateDineInOrderStatus({
              title: 'running',
              pageId: 'dineInRunningOrders',
            })
          "
        >
          {{ _t('Running Orders') }}
        </button>
        <button
          type=""
          id="completed-orders"
          class="tables-btn-style"
          :class="{ active: dineInTabType === 'completed' }"
          @click="
            updateDineInOrderStatus({
              title: 'completed',
              pageId: 'dineInCompleteOrders',
            })
          "
        >
          {{ _t('Completed Orders') }}
        </button>
      </div>
      <span class="hideBigIcon" @click="showBookingBtn">
        <i aria-hidden="true" class="fa fa-chevron-down"></i>
      </span>
    </div>
  </div>
</template>

<script>
/* global $ */
/*global posConfigLinks*/
import { mapState, mapGetters, mapActions } from 'vuex'
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
    ...mapState('dinein', ['dineInTabType']),
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
    updateDineInOrderStatus: function(orderStatus) {
      this.$store.dispatch('dinein/updateDineInOrderStatus', orderStatus)
    },
    ...mapActions('auth', ['logout']),
    changeLanguage(locale) {
      // const language = this.languages.find(lang => lang.code === this.vlocale).code
      bootstrap.loadUI(this.$store)
      this.$store.dispatch('location/changeLanguage', locale)
    },
    openConfigLinks() {
      posConfigLinks()
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
    showBookingBtn() {
      $('.hideBigScreen .all-booking-btns').toggleClass('active')
      $('.hideBigIcon').toggleClass('active')
    },
    /*...mapActions('customer', ['fetchCustomerAddress']),*/
  },
  mounted() {
    this.onlineOrders()
  },
}
</script>
