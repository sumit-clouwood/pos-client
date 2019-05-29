export default {
  _t: state => str => {
    if (state.translations[str]) {
      return state.translations[str]
    }
    return str
  },
}
