<template>
  <div class="change-location" v-if="haveMultipleStores">
    <button class="tables-btn-style" @click="showStoresPopup">
      Switch Stores
    </button>
  </div>
</template>
<script>
/* global $ */
import { mapGetters } from 'vuex'
export default {
  name: 'SwitchStore',
  computed: {
    ...mapGetters('context', ['store', 'haveMultipleStores']),
  },
  methods: {
    showStoresPopup() {
      $('#multiStoresModal').modal('show')
    },
  },
}
</script>
<style lang="scss" scoped>
.change-location {
  margin-left: 10px;
  margin-right: -10px;
}
.tables-btn-style {
  background: #5056ca;
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 500;
}
</style>
