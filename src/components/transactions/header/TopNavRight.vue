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
        <a class="btn-part color-text-invert" href="javascript:void(0)">
          {{ _t('Online') }}
          <span class="online-digit color-secondary">2</span>
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
      <ul class="setting-dropdown1 setting-dropdown-transaction">
        <li>
          <a href="javascript:void(0)">{{ _t('Printers') }}</a>
        </li>
        <li v-if="permitted('dashboard', 'root')">
          <a :href="dashboard">{{ _t('Dashboard') }}</a>
        </li>
        <li v-if="permitted('crm', 'root')">
          <a :href="crm">{{ _t('CRM') }}</a>
        </li>
        <li @click="moveDineSection()">
          <a role="button">
            {{ _t('Dine In') }}
          </a>
        </li>
        <li v-if="permitted('menu', 'root')">
          <a :href="menu">{{ _t('Menu Setup') }}</a>
        </li>
        <li v-if="permitted('delivery', 'root')">
          <a href="javascript:void(0)">
            <router-link :to="'/delivery-manager' + store">
              {{ _t('Delivery Manager') }}
            </router-link>
          </a>
        </li>
        <li v-if="permitted('brand', 'root')">
          <a :href="brand">{{ _t('Settings') }}</a>
        </li>
        <li>
          <a href="javascript:void(0)" @click="logout()">{{ _t('Logout') }}</a>
        </li>
      </ul>
    </li>
  </div>
</template>

<script>
/*global $*/
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
      $('.setting-dropdown-transaction').css('display', 'none')
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
    openConfigLinks() {
      $('.setting-dropdown-transaction').toggle()
      $('.setting-dropdown-transaction').toggleClass('animated zoomIn')
      // posConfigLinks()
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
@import '../../../assets/scss/pixels_rem.scss';
@import '../../../assets/scss/variables.scss';
@import '../../../assets/scss/mixins.scss';
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
