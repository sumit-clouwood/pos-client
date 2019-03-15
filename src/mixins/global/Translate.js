export default {
  data: function() {
    return {
      locale: new Map([
        ['en_US', 'en_US'],
        ['et_EE', 'et_EE'],
        ['ar_SA', 'ar_SA'],
      ]).get(
        localStorage.getItem('selectedLanguageSortName') ||
          process.env.VUE_APP_I18N_LOCALE ||
          process.env.VUE_APP_I18N_FALLBACK_LOCALE ||
          'en_US'
      ),
    }
  },

  methods: {
    t(data) {
      if (!data) {
        return { name: '' }
      }
      return data.find(
        entry =>
          entry.language ==
          (this.locale || localStorage.getItem('selectedLanguageSortName'))
      )
      // if (!res) {
      //   if (Array.isArray(data)) {
      //     const res = data[0]
      //     if (!res.name) {
      //       return {
      //         name: res,
      //       }
      //     }
      //     return res
      //   }
      //   return data
      // }
      // return res
    },
  },
}
