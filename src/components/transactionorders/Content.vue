<template>
  <div class="main">
    <Transactions />
    <Cart />
  </div>
</template>

<script>
import Transactions from './content/Transactions'
import Cart from './content/Cart'

export default {
  name: 'Contents',
  props: {},
  components: {
    Transactions,
    Cart,
  },
}
</script>
<style scoped>
.inner-container {
  width: 100%;
}
</style>
