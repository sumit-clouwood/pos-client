<template>
  <ul class="navbar-nav ml-auto">
    <li class="nav-item">
      <a class="nav-link mr-lg-2" id="adminDropdown" href="#">
        <span class="">{{ username }}</span>
      </a>
    </li>
    <li class="nav-item">
      <h6 class="header-online">
        <span
          ><i class="fa fa-fw fa-circle" :class="{ online: online }"></i
        ></span>
        {{ _t('Online') }}
      </h6>
    </li>
    <li v-if="availableLanguages">
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
    <li class="nav-item" data-toggle="modal" data-target="#alert">
      <a class="btn-part" href="#">{{ _t('3 part 27') }}</a>
    </li>
    <li
      class="nav-item online-data"
      data-toggle="modal"
      data-target="#online-order"
    >
      <a class="btn-part" href="#" @click="fetchCustomerAddress">
        {{ _t('Online') }}
        <span class="online-digit" v-if="latestOnlineOrders > 0">
          {{ latestOnlineOrders }}
        </span>
        <span class="online-digit" v-if="latestOnlineOrders === 0">
          {{ onlineOrdersCount }}
        </span>
      </a>
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
        <li>
          <a href="#">{{ _t('Printers') }}</a>
        </li>
        <li>
          <a href="#">{{ _t('Logout') }}</a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'TopNavRight',
  props: {},
  data: function() {
    return {
      onlineOrdersCount: 0,
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
    ...mapState('location', ['availableLanguages', 'language']),
    ...mapState('sync', ['online']),
    ...mapState({
      latestOnlineOrders: state =>
        state.order.onlineOrders ? state.order.onlineOrders.length : 0,
      username: state =>
        state.auth.userDetails ? state.auth.userDetails.name : '',
    }),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    changeLanguage(locale) {
      // const language = this.languages.find(lang => lang.code === this.vlocale).code
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
    ...mapActions('customer', ['fetchCustomerAddress']),
  },
  mounted() {
    this.onlineOrders()
  },
}
</script>
<style lang="scss" scoped>
.fa-circle:before {
  color: #eb790f;
}
.fa-circle.online:before {
  color: #62bb31;
}
</style>
