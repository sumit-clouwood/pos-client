<template>
  <div class="main-orders">
    <Header />
    <div class="main-orders-list-wrapper">
      <Items />
      <HoldingOrders />
    </div>
    <PayNow v-show="order" />
    <Footer />
  </div>
</template>

<script>
import Header from './cart/newOrders/Header.vue'
import HoldingOrders from './cart/HoldingOrders'
import Footer from './cart/Footer'
import PayNow from './cart/PayNow'
import Items from './cart/newOrders/Items.vue'

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
    Header,
    Items,
    HoldingOrders,
    Footer,
    PayNow,
  },
}
</script>
