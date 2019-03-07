export default {
  data: function() {
    return {
      locale: new Map([
        ['en_US', 'en_US'],
        ['et_EE', 'et_EE'],
        ['ar_SA', 'ar_SA'],
      ]).get(
        localStorage.getItem('selectedLanguage') ||
          process.env.VUE_APP_I18N_LOCALE ||
          process.env.VUE_APP_I18N_FALLBACK_LOCALE ||
          'en_US'
      ),
    }
  },

  methods: {
    t(data) {
      return data.find(entry => entry.language == this.locale)
    },
  },
}
