<template>
  <div class="main-transaction-container">
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
.main-transaction-container {
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>
