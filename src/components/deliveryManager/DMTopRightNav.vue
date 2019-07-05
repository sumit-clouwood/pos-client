<template>
  <div class="page-header">
    <div class="current-time">
      <div class="header-main-left-time">
        <span>{{ todayDate }} </span>
        <span class="time"> {{ todayTime }}</span>
      </div>
    </div>
    <!--<ul class="hide">
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
    </ul>-->
    <div class="button-block">
      <div class="change-location">
        <button class="btn btn-success">Change Brand</button>
        <button class="btn btn-success walkin-btn">
          <router-link :to="store" class="text-white">Walk-in</router-link>
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
        <img src="/img/icons/us.svg" />
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
        >
          {{ language.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// /* global $ */
/* eslint-disable no-console */
import moment from 'moment-timezone'
import { mapGetters, mapState } from 'vuex'
import bootstrap from '@/bootstrap'
export default {
  name: 'DMTopRightNav',
  computed: {
    ...mapGetters('context', ['store']),
    ...mapState('location', ['availableLanguages', 'language']),
  },
  methods: {
    changeLanguage(locale) {
      // const language = this.languages.find(lang => lang.code === this.vlocale).code
      bootstrap.loadUI(this.$store)
      this.$store.dispatch('location/changeLanguage', locale)
    },
    /*selectedReason: function(reason) {
      this.showSelectedReason = reason.name
      $('.dropdown-content').hide()
    },
    showDropdown: function() {
      $('.dropdown-content').show()
    },*/
  },
  data() {
    return {
      todayDate: moment().format('MMMM Do YYYY'),
      todayTime: moment().format('h:mm:ss a'),
      showSelectedLanguage: '',
    }
  },
  mounted: function() {
    setInterval(() => {
      this.todayTime = moment().format('h:mm:ss a')
    }, 1000)
  },
}
</script>
