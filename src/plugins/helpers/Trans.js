export default {
  _t(item, description = false) {
    let name = ''
    if (item.translations_dict) {
      const locale = this.$store.state.location.locale
      if (!description) {
        if (item.translations_dict.name[locale]) {
          name = item.translations_dict.name[locale]
        } else if (item.translations_dict.name[locale] == null) {
          name = item.name
        }
      } else {
        if (item.translations_dict[description][locale]) {
          name = item.translations_dict.description[locale]
        } else if (item.translations_dict.description[locale] == null) {
          name = item.description
        }
      }
      /*for (let i in item.translations_dict.name) {
        name = item.translations_dict.name[i]
      }*/
    }
    return name == '' ? item.name : name
  },
}
