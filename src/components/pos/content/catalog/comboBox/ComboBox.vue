<template>
  <div class="modal fade" id="combox-box-popup" role="dialog">
    <div class="modal-dialog">
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
  max-width: 600px;
}
</style>
