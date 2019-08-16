<template>
  <div class="right-btn-wrap">
    <button
      type="button"
      class="btn dropdown-toggle input-search-driver"
      data-toggle="dropdown"
    >
      {{ selectedStore }}
    </button>
    <ul class="dropdown-menu">
      <li v-for="(store, key) in branch" :key="key">
        <a role="button" @click="getLocationOrders(store)">
          {{ store.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapState } from 'vuex'
export default {
  name: 'Branches',
  data() {
    return {
      selectedStore: 'All Store',
    }
  },
  computed: {
    ...mapState({
      branch: state => state.deliveryManager.availableStores,
    }),
  },
  methods: {
    getLocationOrders: function(store) {
      this.$store.dispatch('deliveryManager/fetchStoreOrders', store._id)
      this.selectedStore = store.name
    },
  },
}
</script>

<style scoped></style>
