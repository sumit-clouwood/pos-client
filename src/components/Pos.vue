<template>
  <div class="new-pos">
    <Menu />
    <Header />
    <Content />
    <Footer />
    <mobileIndex />
  </div>
</template>

<i18n>
    {
    "en": {
    "title": "Broccoli POS (En)",
    "body": "Broccoli POS Body (En)"
    },
    "ar": {
    "title": "Broccoli POS (Ar)",
    "body": "Broccoli POS Body (Ar)"
    }
    }
</i18n>

<script>
/* eslint-disable no-console */
import Menu from './pos/Menu.vue'
import Header from './pos/Header.vue'
import Content from './pos/Content.vue'
import Footer from './pos/Footer'
import mobileIndex from './mobileComponents/_mobileIndex.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Pos',
  computed: {
    ...mapState('category', ['categories']),
    ...mapState('auth', ['role']),
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['carhop', 'waiter']),
  },
  mounted() {
    if (this.waiter) {
      if (
        this.$route.path !== 'undefined' &&
        !this.$route.path.match('dine-in')
      ) {
        this.$router.replace('/dine-in' + this.store + '/')
      }
    } else if (this.carhop) {
      this.$router.replace('/carhop' + this.store + '/')
    } else {
      this.$router.replace(this.store)
    }
  },
  created() {
    // if (localStorage.getItem('token')) {
    //   let user_session_loop = setInterval(() => {
    //     let user_token = this.$store.state.auth.token
    //     if (user_token && user_token !== localStorage.getItem('token')) {
    //       this.$store.dispatch('auth/logout', 'tab logout reset')
    //     }
    //     // eslint-disable-next-line
    //     //console.log('user_token is ' + user_token + 'Ls token is ' + localStorage.getItem('token'))
    //     if (localStorage.getItem('token') === '') {
    //       clearInterval(user_session_loop)
    //     }
    //   }, 5000)
    // }
  },
  components: {
    Menu,
    Header,
    Content,
    Footer,
    mobileIndex,
  },
  //store private data in component using data

  //data passed to this component by its parent is contained inside props
  props: {
    msg: String,
  },
}
</script>
<style scoped>
.user-profile {
  align-self: center;
}
</style>
