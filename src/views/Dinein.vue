<template>
  <div class="new-pos dine-in-wrapper">
    <div class="dm-screen-wrap toggle-nav-content">
      <Header />
    </div>
    <SystemNavigation />
    <!-- Breadcrumbs-->
    <div class="content-wrapper toggle-nav-content" id="dm-content-wrapper">
      <div class="inner-content-dm">
        <Preloader v-if="loading" />
        <Content v-else />
        <Footer />
      </div>
    </div>
    <div class="modal-backdrop fade show" id="transparent-screen"></div>
    <ready-item-notification></ready-item-notification>
  </div>
</template>

<script>
/* global $ */
import ReadyItemNotification from '@/components/dinein/popup/ReadyItemNotification'
import SystemNavigation from '@/components/SystemNavigation'
import Header from '@/components/dinein/Header.vue'
import Content from '@/components/dinein/Content'
import Footer from '@/components/dinein/Footer'
import { mapState, mapGetters } from 'vuex'
// import Preloader from '@/components/util/progressbar'
import Preloader from '@/components/util/progressbar'

export default {
  name: 'Dinein',
  components: {
    ReadyItemNotification,
    Header,
    SystemNavigation,
    Content,
    Footer,
    Preloader,
  },
  //store private data in component using data
  data: function() {
    return {
      info: null,
      errored: false, //either request had error
    }
  },

  //data passed to this component by its parent is contained inside props
  props: {
    msg: String,
  },
  computed: {
    ...mapState('dinein', ['loading']),
    ...mapGetters('auth', ['carhop', 'waiter']),
  },
  mounted() {
    this.$store.commit('dinein/IS_MODIFIED', false)

    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer dm-manager')

    if (this.carhop) {
      this.$router.replace('/carhop' + this.store + '/')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/*@import '../assets/scss/dine-in/dineIn.css';*/
</style>
