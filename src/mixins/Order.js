export default {
  data: function() {},

  mounted() {},

  methods: {
    loadFromCollection(orderEntities, key, map, store, stateItem, keysToLoad) {
      if (!Array.isArray(orderEntities) || !key || !map) {
        return orderEntities
      }

      return orderEntities.map(entity => {
        this.$store.state[store][stateItem].forEach(item => {
          if (entity[key] === item[map]) {
            keysToLoad.forEach(index => {
              if (item[index]) {
                entity[index] = item[index]
              }
            })
          }
        })
        return entity
      })
    },
  },
}
