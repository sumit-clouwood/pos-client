<template>
  <div class="modal-footer color-dashboard-background">
    <p class="text-danger" v-if="errorMessage">{{ errorMessage }}</p>
    <div class="btn-announce apply_btn">
      <AddModifierOrderButton @error="error" />
      <RemoveFromComboButton
        v-if="combo_item_with_mods"
      ></RemoveFromComboButton>
    </div>
  </div>
</template>

<script>
//this footer ll be always called by the catalog and modifiers items only
import AddModifierOrderButton from './footer/AddModifierOrderButton'
import RemoveFromComboButton from './footer/RemoveFromComboButton'
export default {
  name: 'Footer',
  props: {},
  data() {
    return {
      errorMessage: false,
    }
  },
  components: {
    AddModifierOrderButton,
    RemoveFromComboButton,
  },
  computed: {
    combo_item_with_mods() {
      const item = this.$store.getters['combo/current_combo_selected_item']
      if (
        this.$store.getters['combo/current_order_combo'] &&
        item &&
        this.$store.getters['modifier/hasModifiers'](item)
      ) {
        return true
      }
      return false
    },
  },
  methods: {
    error(errorMessage) {
      this.errorMessage = errorMessage
    },
  },
  mounted() {
    setTimeout(() => {
      this.errorMessage = false
    }, 3000)
  },
}
</script>
