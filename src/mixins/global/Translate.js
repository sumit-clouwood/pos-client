export default {
  data: function() {
    return {
      locale:
        localStorage.getItem('locale') ||
        process.env.VUE_APP_I18N_LOCALE ||
        process.env.VUE_APP_I18N_FALLBACK_LOCALE ||
        'en_US',
    }
  },

  methods: {
    t(data) {
      if (!data) {
        return { name: '' }
      }

      let res = data.find(
        entry =>
          entry.language == (this.locale || localStorage.getItem('locale'))
      )

      if (!res) {
        res = data.find(entry => entry.language == 'en_US')
      }

      if (!res) {
        res = {
          name: '',
        }
      }

      return res
    },
  },
}
