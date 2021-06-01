<template>
  <div class="new-pos dine-in-wrapper carhop-wrapper">
    <div class="dm-screen-wrap toggle-nav-content">
      <Header />
    </div>
    <SystemNavigationCarhop />
    <div class="content-wrapper toggle-nav-content" id="dm-content-wrapper">
      <div class="inner-content-dm">
        <Content />
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
import SystemNavigationCarhop from '@/components/SystemNavigationCarhop'
import Header from '@/components/carhop/Header.vue'
import Content from '@/components/carhop/Content'
import Footer from '@/components/carhop/Footer'
import * as CONST from '@/constants'

export default {
  name: 'Dinein',
  components: {
    Header,
    ReadyItemNotification,
    SystemNavigationCarhop,
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
    this.$store.commit('order/ORDER_TYPE', {
      OTview: 'Carhop',
      OTApi: CONST.ORDER_TYPE_CARHOP,
    })
    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer dm-manager')
  },
}
</script>
<style lang="scss"></style>
