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
        <button class="btn btn-success">
          <a :href="baseurl('delivery')">{{ _t('Change Brand') }}</a>
        </button>
        <button class="btn btn-success walkin-btn">
          <router-link :to="store" class="text-white">
            {{ _t('Walk-in') }}Select
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
          href="javascript:void(0)"
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
  </div>
</template>

<script>
/* eslint-disable no-console  */
/* global $ */
import moment from 'moment-timezone'
import { mapGetters, mapState } from 'vuex'
import bootstrap from '@/bootstrap'
export default {
  name: 'DMTopRightNav',
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
    ...mapGetters('location', ['_t']),
  },
  methods: {
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
  },
  data() {
    return {
      todayDate: moment().format('MMMM Do YYYY'),
      todayTime: moment().format('h:mm:ss a'),
      showSelectedLanguage: '',
      iconCodeSelection: 'us',
    }
  },
  mounted: function() {
    setInterval(() => {
      this.todayTime = moment().format('h:mm:ss a')
    }, 1000)
  },
}
</script>
