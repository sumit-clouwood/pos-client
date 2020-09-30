<template>
  <div class="modal-header color-secondary">
    <h5
      class="modal-title color-text-invert"
      id="POSItemOptionsTitle"
      v-if="modifierItem"
    >
      {{ dt(modifierItem) }}
    </h5>
    <h5
      class="modal-title color-text-invert"
      id="POSItemOptionsTitle"
      v-else-if="current_combo_selected_item"
    >
      {{ dt(current_combo_selected_item) }}
    </h5>
    <CloseButton />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CloseButton from './header/CloseButton'

export default {
  name: 'Header',
  props: {},
  computed: {
    ...mapState({
      modifierItem: state => state.modifier.item,
    }),
    ...mapGetters('combo', ['current_combo_selected_item']),
  },
  components: {
    CloseButton,
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/mixins.scss';
@include responsive(mobile) {
  .modal-header {
    background-color: #d7dce2;
  }
}
</style>
