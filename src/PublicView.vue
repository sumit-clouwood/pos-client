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
      if (
        this.$store.state.auth.logoutAction === 'switchCashier' ||
        localStorage.getItem('logoutAction') === 'switchCashier'
      ) {
        return true
      }
      return false
    },
    loginContext() {
      return true
    },
  },
}
</script>
