export default {
  data: function() {
    return {
      locale: new Map([['en', 'en_US'], ['et', 'et_EE'], ['ar', 'ar_SA']]).get(
        process.env.VUE_APP_I18N_LOCALE ||
          process.env.VUE_APP_I18N_FALLBACK_LOCALE ||
          'en'
      )
    };
  },

  methods: {
    t(data) {
      return data.find(entry => entry.language == this.locale);
    }
  }
};
