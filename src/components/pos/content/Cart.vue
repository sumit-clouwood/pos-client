<template>
  <div class="col-md-4 orders-panel">
    <NewOrders />
    <HoldingOrders />
    <Footer />
  </div>
</template>

<script>
import NewOrders from './cart/NewOrders'
import HoldingOrders from './cart/HoldingOrders'
import Footer from './cart/Footer'

export default {
  name: 'Cart',
  props: {
    msg: String,
  },
  components: {
    NewOrders,
    HoldingOrders,
    Footer,
  },
}
</script>
