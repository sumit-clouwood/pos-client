<template>
  <ul class="navbar-nav ml-auto">
    <li class="nav-item">
      <a class="nav-link mr-lg-2" id="adminDropdown" href="#">
        <span class="">Admin</span>
      </a>
    </li>
    <li class="nav-item">
      <h6 class="header-online">
        <span><i class="fa fa-fw fa-circle"></i></span> Online
      </h6>
    </li>
    <li v-if="languages">
      <select
        v-model="selectedShortname"
        @change="changeLanguage(selectedShortname)"
        class="language-button"
      >
        <option :value="selectedShortname"> Select Language </option>
        <option
          v-for="language in languages"
          :key="language._id"
          :value="language.shortname"
        >
          {{ language.language }}
        </option>
      </select>
    </li>
    <li class="nav-item" data-toggle="modal" data-target="#alert">
      <a class="btn-part" href="#">3 part 27</a>
    </li>
    <li
      class="nav-item online-data"
      data-toggle="modal"
      data-target="#online-order"
    >
      <a class="btn-part" href="#" @click="fetchCustomerAddress"
        >online
          <span class="online-digit" v-if="latestOnlineOrders > 0">
              {{ latestOnlineOrders }}
          </span>
          <span class="online-digit" v-if="latestOnlineOrders === 0">
              {{ onlineOrdersCount }}
          </span>
      </a
      >
    </li>
    <li class="nav-item setting-icon" id="setting-icon">
      <a class="nav-link">
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
          ></path>
        </svg>
      </a>
    </li>
    <li>
      <ul class="setting-dropdown animated zoomIn" style="display: none;">
        <li><a href="#">Printers</a></li>
        <li><a href="#">Logout</a></li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TopNavRight',
  props: {},
  data() {
    return {
      selectedShortname:
        typeof this.defaultLanguage != 'undefined'
          ? this.defaultLanguage.shortname
          : 'en_US',
      langSelected: localStorage.getItem('selectedLanguage'),
      onlineOrdersCount: 0,
    }
  },
  mounted() {
    this.onlineOrders()
  },
  computed: {
    ...mapState({
      languages: state =>
        typeof state.location.locationData !== 'undefined'
          ? state.location.locationData.languages
          : false,
    }),
    ...mapState({
      defaultLanguage: state =>
        typeof state.location.locationData !== 'undefined'
          ? state.location.locationData.default_language[0]
          : false,
    }),
    ...mapState({
      latestOnlineOrders: state =>
        typeof state.order.onlineOrders.orders != 'undefined'
          ? state.order.onlineOrders.orders.length
          : 0,
    }),
  },
  methods: {
    ...mapActions('location', ['changeLanguage']),
    onlineOrders() {
      if (this.latestOnlineOrders == 0) {
        if (JSON.parse(localStorage.getItem('onlineOrders')) != null) {
          this.onlineOrdersCount = JSON.parse(
            localStorage.getItem('onlineOrders')
          ).orders.length
        } else {
          this.onlineOrdersCount = 0
        }
      } else {
	      this.onlineOrdersCount = this.latestOnlineOrders
      }
    },
    ...mapActions('customer', ['fetchCustomerAddress']),
  },
}
</script>
