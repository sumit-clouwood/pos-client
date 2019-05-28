// import * as utils from '@/utils/main_utils'
import Vue from 'vue'
export default {
  state: {
    translations: {},
    current_lang: 'en-US',
    lang_direction: 'ltr',
    available_languages: {},
  },
  mutations: {
    SET_LANG_DIRECTION(state, direction) {
      state.lang_direction = direction
      document.body.style.direction = direction
      Vue.prototype.$vuetify.rtl = direction == 'ltr' ? false : true
      document.body.classList.remove('body-ltr')
      document.body.classList.remove('body-rtl')
      document.body.classList.add('body-' + direction)
    },
    SET_CURRENT_LANG: (state, lang) => (state.current_lang = lang),
    SET_TRANSLATIONS: (state, translations) =>
      (state.translations = translations),
    SET_AVAILABLE_LANGUAGES: (state, avail_languages) =>
      (state.available_languages = avail_languages),
  },
  actions: {
    changeCurrentLang: ({ dispatch, getters }, lang) => {
      if (getters.current_lang != lang) {
        dispatch('forceReloadContext', lang)
      }
    },
    process_warning(error) {
      // eslint-disable-next-line no-console
      console.warn(
        'Warning reported: ' + error + ', url: ' + document.location.href
      )
      //axios.post(store.getters.logging_url, {'warning': error})
    },
  },
  getters: {
    _T: state => str => {
      if (state.translations[str]) {
        return state.translations[str]
      }
      this.process_warning(`no ${str} translation exists`)
      return str
    },
    current_lang: state => state.current_lang,
    current_locale: state => state.current_lang.slice(0, 2),
    available_languages: state => state.available_languages,
  },
}
