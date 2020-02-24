<template>
  <div class="modal-header color-secondary" v-if="item">
    <h5 class="modal-title color-text-invert" id="POSItemOptionsTitle">
      {{ dt(item) }}
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
    ...mapGetters('location'),
    ...mapState({
      item: state => state.modifier.item,
    }),
  },
  components: {
    CloseButton,
  },
}
</script>
