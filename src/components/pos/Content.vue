<template>
  <div class="main">
    <Announcement />
    <catalog />
    <Cart />
  </div>
</template>

<script>
import Catalog from './content/Catalog'
import Announcement from './header/Announcement'
import Cart from './content/Cart'

export default {
  name: 'Contents',
  props: {},
  components: {
    Catalog,
    Cart,
    Announcement,
  },
}
</script>
<style scoped>
.inner-container {
  width: 100%;
}
</style>
