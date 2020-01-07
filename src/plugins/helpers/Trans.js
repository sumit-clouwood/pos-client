export default {
  _t(item) {
    if (item.translations_dict) {
      const locale = this.$store.state.location.locale
      if (item.translations_dict.name[locale]) {
        return item.translations_dict.name[locale]
      } else if (item.translations_dict.name[locale] == null) {
        return item.name
      }
      for (let i in item.translations_dict.name) {
        return item.translations_dict.name[i]
      }
    }
    return item.name
  },
}
