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
      $('#myModal').modal('show')
    },
  },
}
</script>
<style lang="scss" scoped>
.tables-btn-style {
  background: #5056ca;
  color: white;
  border: none;
  font-size: 12.75px;
}
</style>
