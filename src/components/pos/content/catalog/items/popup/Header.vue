<template>
  <div class="modal-header" v-if="item">
    <h5 class="modal-title" id="POSItemOptionsTitle">
      {{ item.name }}
    </h5>
    <CloseButton />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CloseButton from './header/CloseButton'

export default {
  name: 'Header',
  props: {},
  computed: {
    ...mapState({
      item: state => state.modifier.item,
    }),
  },
  components: {
    CloseButton,
  },
}
</script>
