<template>
  <div class="modal-header color-secondary" v-if="item">
    <h5 class="modal-title color-text-invert" id="POSItemOptionsTitle">
      {{ dt(item) }}
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

<style lang="scss">
@import '@/assets/scss/mixins.scss';
@include responsive(mobile) {
  .modal-header {
    background-color: #d7dce2;
  }
}
</style>
