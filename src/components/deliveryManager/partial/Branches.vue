<template>
  <div class="right-btn-wrap">
    <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
      All Stores
    </button>
    <ul class="dropdown-menu">
      <li v-for="(store, key) in branch" :key="key">
        <a href="javascript:void(0)" @click="getLocationOrders(store._id)">
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
  computed: {
    ...mapState({
      branch: state => state.deliveryManager.availableStores,
    }),
  },
  methods: {
    getLocationOrders: function(storeId) {
      this.$store.dispatch('deliveryManager/fetchStoreOrders', storeId)
    },
  },
}
</script>

<style scoped></style>
