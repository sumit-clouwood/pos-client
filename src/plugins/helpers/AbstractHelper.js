export default class AbstractHelper {
  constructor($store, event, data, context) {
    this.$store = $store
    this.data = data
    this.event = event
    this.context = context
  }

  exec() {}
}
