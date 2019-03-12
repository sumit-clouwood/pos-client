<template>
  <div class="col-md-4 orders-panel">
    <NewOrders />
    <HoldingOrders />
    <PayNow v-show="order" />
    <Footer />
  </div>
</template>

<script>
import NewOrders from './cart/NewOrders'
import HoldingOrders from './cart/HoldingOrders'
import Footer from './cart/Footer'
import PayNow from './cart/PayNow'
import { mapState } from 'vuex'

export default {
  name: 'Cart',
  props: {
    msg: String,
  },
  computed: {
    ...mapState('checkout', ['order']),
  },
  components: {
    NewOrders,
    HoldingOrders,
    Footer,
    PayNow,
  },
}
</script>
