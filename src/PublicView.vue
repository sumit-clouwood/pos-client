<!--
The App.vue file is the root component that all other components are nested within.
-->
<template>
  <div>
    <login v-if="!cashierContext" class="login"></login>
    <router-view />
  </div>
</template>
<script>
import Login from '@/components/login/Login'

export default {
  name: 'PublicView',
  components: {
    Login,
  },
  computed: {
    cashierContext() {
      if (this.$store.state.auth.logoutAction === 'switchCashier') {
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
