<template>
  <div>
    <cashier class="cashier" v-if="cashierContext"></cashier>
    <login v-else class="login"></login>
  </div>
</template>
<script>
import Login from '@/components/login/Login'
import Cashier from '@/components/login/Cashier'

export default {
  name: 'PublicView',
  components: {
    Login,
    Cashier,
  },
  computed: {
    cashierContext() {
      return this.$route.name === 'cashierLogin'
    },
    loginContext() {
      return true
    },
  },
}
</script>
