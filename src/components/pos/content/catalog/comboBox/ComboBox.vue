<template>
  <div class="modal fade combox_p" id="combox-box-popup" role="dialog">
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
.modal-dialog {
  max-width: 800px;
}
.combox_p {
  z-index: 999;
}
div#combox-box-popup {
  padding-left: 0px !important;
  padding-right: 0.938rem;
}
</style>
