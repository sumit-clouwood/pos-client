<template>
  <div class="row inner-container">
    <Catalog />
    <Cart />
  </div>
</template>

<script>
import Cart from './content/Cart';
import Catalog from './content/Catalog';
export default {
  name: 'Content',
  props: {},
  components: {
    Catalog,
    Cart
  }
};
</script>
<style scoped>
.inner-container {
  width: 100%;
}
</style>
