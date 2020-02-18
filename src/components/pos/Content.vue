<template>
  <div class="main">
    <Announcement />
    <catalog />
    <Cart />
    <Popup />
  </div>
</template>

<script>
import Catalog from './content/Catalog'
import Announcement from './header/Announcement'
import Cart from './content/Cart'
import Popup from './content/catalog/items/Popup'
export default {
  name: 'Contents',
  props: {},
  components: {
    Catalog,
    Cart,
    Announcement,
    Popup,
  },
}
</script>
<style scoped>
.inner-container {
  width: 100%;
}
</style>
