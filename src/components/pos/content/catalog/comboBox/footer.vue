<template>
  <div class="modal-footer">
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-success btn-default "
        data-dismiss="modal"
        @click="addComboItemCart"
      >
        {{ _t('Add to Order') }}
      </button>
      <button
        type="button"
        class="btn btn-danger cancel-announce"
        data-dismiss="modal"
        @click="emptyComboSelection"
      >
        {{ _t('Cancel') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('comboItems', ['comboItemsList', 'activeComboItems']),
  },
  data() {
    return {
      comboItem: [],
    }
  },
  methods: {
    addComboItemCart() {
      this.comboItem[this.comboItemsList._id] = this.activeComboItems
      // eslint-disable-next-line no-console
      console.log(this.comboItem)
    },
    emptyComboSelection() {
      this.comboItem[this.comboItemsList] = false
      this.$store.commit('comboItems/ACTIVE_COMBO_ITEMS', false)
    },
  },
}
</script>
<style scoped>
@media only screen and (max-width: 600px) and (min-width: 320px) {
  .btn-announce {
    margin: 0 auto;
  }
}
</style>
