<template>
  <div class="title">
    <h2>{{ msg }}</h2>
    <Products msg="POS products"/>
  </div>
</template>

<script>
import Products from './content/Products.vue'
export default {
  name: 'Content',
  props: {
    msg: String
  },
  components : {
      Products
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