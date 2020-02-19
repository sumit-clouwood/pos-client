<template>
  <div class="menu-language">
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
    >
      <a
        class="dropdown-item"
        role="button"
        v-for="language in availableLanguages"
        :key="language._id"
        :value="language.code"
        @click="iconCode(language)"
      >
        <span>
          <img :src="'/img/flag_icon/4x3/' + language.icon_code + '.svg'" />
        </span>
        {{ language.name }}
      </a>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import bootstrap from '@/bootstrap'
export default {
  name: 'LanguageMenu',
  props: {},
  data() {
    return {
      iconCodeSelection: 'us',
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
    iconCode: function(language) {
      this.iconCodeSelection = language.icon_code
      this.changeLanguage(language.code)
    },
    ...mapActions('auth', ['logout']),
    changeLanguage(locale) {
      this.$store.commit('location/SET_LOCALE', locale)
      // const language = this.languages.find(lang => lang.code === this.vlocale).code
      this.$store.dispatch('location/changeLanguage', locale)
      bootstrap.loadUI(this.$store).then(() => {
        this.$store.dispatch('location/updateTranslations', locale)
      })
    },

    /*...mapActions('customer', ['fetchCustomerAddress']),*/
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
#dropdownLanguage {
  min-height: 3.3rem !important;
}
</style>
