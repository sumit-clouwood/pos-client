<template>
  <div class="page-header">
    <div class="current-time">
      <div class="header-main-left-time">
        <a href="javascript:void(0)">
          <span>{{ todayDate }}</span>
          &nbsp;
          <span class="time">{{ todayTime }}</span>
        </a>
      </div>
    </div>
    <ul>
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
    </ul>
    <div class="button-block">
      <div class="change-location">
        <button class="btn btn-success">Change Brand</button>
        <button class="btn btn-success walkin-btn">
          <router-link :to="store" class="text-white">Walk-in</router-link>
        </button>
      </div>
      <div class="lang-selector">
        <div class="v-menu v-menu--inline">
          <div class="v-menu__activator">
            <button type="button" class="v-btn v-btn--icon theme--light">
              <div class="v-btn__content">
                <div class="lang-flag-container">
                  <img src="/img/icons/us.svg" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  },
  data() {
    return {
      todayDate: moment().format('MMMM Do YYYY'),
      todayTime: moment().format('h:mm:ss a'),
    }
  },
  mounted: function() {
    setInterval(() => {
      this.todayTime = moment().format('h:mm:ss a')
    }, 1000)
  },
}
</script>
