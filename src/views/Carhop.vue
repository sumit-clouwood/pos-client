<template>
  <div class="new-pos dine-in-wrapper">
    <div class="dm-screen-wrap toggle-nav-content">
      <Header />
    </div>
    <SystemNavigation />
    <div class="content-wrapper toggle-nav-content" id="dm-content-wrapper">
      <div class="inner-content-dm">
        <Content />
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

export default {
  name: 'Dinein',
  components: {
    Header,
    SystemNavigation,
    Content,
    Footer,
  },
  data: function() {
    return {}
  },

  props: {
    msg: String,
  },
  computed: {},
  mounted() {
    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer dm-manager')
  },
}
</script>
