<template>
  <div class="title">
    {{ msg }}
  </div>
</template>

<script>
export default {
  name: 'Products',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/assets/sass/variables.scss';
.top {
  color : $primary-color;
}
</style>