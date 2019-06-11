<template>
  <div :class="['main-orders', {active: mainOrdersHendler}]">
    <div class="main-orders-title">
      <div class="text">Current Sale Detail</div>
      <div class="button" @click="cartClose"><i class="fa fa-angle-up" aria-hidden="true"></i></div>
    </div>
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

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Cart',
  props: {
    msg: String,
  },
  computed: {
    ...mapState('checkout', ['order']),
    ...mapGetters(['mainOrdersHendler'])
  },
  methods : {
    cartClose(){
      this.$store.dispatch('cartClose')
    }
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
