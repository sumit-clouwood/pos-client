<template>
  <button
    type="button"
    class="buttoned colorwhite donebutton color-main"
    @click="addModifierOrder"
  >
    <img src="img/pos/done.png" alt="done" />
    <span class="color-text-invert">{{ _t('Apply') }}</span>
  </button>
</template>
<script>
/* global closeModal */
import { bus } from '@/eventBus'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'AddModifierOrderButton',
  props: {},
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('combo', ['current_combo']),
    ...mapState('order', ['noteBeforeItem']),
  },
  methods: {
    addModifierOrder() {
      if (this.current_combo) {
        this.$store.dispatch('combo/selectModifiers').then(() => {
          if (this.noteBeforeItem) {
            this.$store.dispatch('order/addNoteToItem', this.noteBeforeItem)
          }
          closeModal('#POSItemOptions')
          bus.$emit('addComboItemWithModifiers')
        })
        //select modifiers
        //if validated then
        //emit and catch in itemContent
        //add to the current selected items of combo
        //if removed emit and remove from current selection
      } else {
        this.$store
          .dispatch('order/addModifierOrder')
          .then(() => {
            this.$emit('error', false)
            closeModal('#POSItemOptions')
            if (this.noteBeforeItem) {
              this.$store.dispatch('order/addNoteToItem', this.noteBeforeItem)
            }
          })
          .catch(error => this.$emit('error', error))
      }
    },
  },
}
</script>
