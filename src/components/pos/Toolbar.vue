<template>
  <div class="title">
    <h2>{{ msg }}</h2>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
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