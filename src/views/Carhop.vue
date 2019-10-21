<template>
  <div class="new-pos dine-in-wrapper">
    <div class="dm-screen-wrap toggle-nav-content">
      <Header />
    </div>
    <SystemNavigation />
    <div class="content-wrapper toggle-nav-content" id="dm-content-wrapper">
      <div class="inner-content-dm">
        <Preloader v-if="loading" />
        <Content v-else />
        <Footer />
      </div>
    </div>
    <div class="modal-backdrop fade show" id="transparent-screen"></div>
  </div>
</template>

<script>
/* global $ */
import SystemNavigation from '@/components/SystemNavigation'
import Header from '@/components/carhop/Header.vue'
import Content from '@/components/carhop/Content'
import Footer from '@/components/carhop/Footer'
import Preloader from '@/components/util/Preloader'
import { mapState } from 'vuex'

export default {
  name: 'Dinein',
  components: {
    Header,
    SystemNavigation,
    Content,
    Footer,
    Preloader,
  },
  data: function() {
    return {
      info: null,
      errored: false, //either request had error
    }
  },

  props: {
    msg: String,
  },
  computed: {
    ...mapState('dinein', ['loading']),
  },
  mounted() {
    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer dm-manager')
  },
}
</script>
