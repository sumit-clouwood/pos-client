export default {
  _t(item) {
    let name = ''
    if (item.translations_dict) {
      const locale = this.$store.state.location.locale
      if (item.translations_dict.name[locale]) {
        name = item.translations_dict.name[locale]
      } else if (item.translations_dict.name[locale] == null) {
        name = item.name
      }
      /*for (let i in item.translations_dict.name) {
        name = item.translations_dict.name[i]
      }*/
    }
    return name == '' ? item.name : name
  },
}
