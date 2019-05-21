export default {
  methods: {
    getLookupsData(details) {
      const collectionItems = Object.entries(details.collection)
      // eslint-disable-next-line no-console,no-unused-vars
      for (let [key, value] of collectionItems) {
        if (value._id == details.matchWith) {
          return value.name
        }
      }
    },
  },
}
