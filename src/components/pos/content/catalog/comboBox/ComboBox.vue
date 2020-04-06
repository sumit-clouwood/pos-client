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
  min-width: 80vw;
  max-width: 80vw;
  margin: auto !important;
}
.combox_p {
  z-index: 999;
}
div#combox-box-popup {
  padding-left: 0px !important;
  padding-right: 0.938rem;
}
</style>
