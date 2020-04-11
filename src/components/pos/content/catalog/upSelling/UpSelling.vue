<template>
  <div class="modal fade" id="up-selling-popup" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <Content />
    </div>
  </div>
</template>

<script>
import Content from './content'

export default {
  components: {
    Content,
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
#up-selling-popup {
  padding-left: 0px !important;
  @include responsive(mobile) {
    position: fixed !important;
  }
  .modal-dialog {
    margin: auto !important;
    max-width: 70%;
    @include responsive(mobile) {
      max-width: 100%;
    }
  }
}
</style>
