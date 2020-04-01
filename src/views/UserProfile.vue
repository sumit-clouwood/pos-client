<template>
  <div class="new-pos dine-in-wrapper">
    <div class="dm-screen-wrap toggle-nav-content">
      <Header />
    </div>
    <!-- 
          This is a generic System Navigation, 
          some permissions work some don't, 
          carhop user can access dispatch screen, 
          dashboard and inventory etc 
    -->
    <SystemNavigation v-if="!isCarhop() || !isWaiter()" />
    <SystemNavigationCarhop v-else />
    <div class="content-wrapper toggle-nav-content" id="dm-content-wrapper">
      <div class="inner-content-dm">
        <Profile />
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import SystemNavigation from '@/components/SystemNavigation'
import SystemNavigationCarhop from '@/components/SystemNavigationCarhop'
import Header from '@/components/carhop/Header.vue'
import Profile from '@/components/pos/user/UserProfile'

export default {
  name: 'Dinein',
  components: {
    Header,
    SystemNavigation,
    SystemNavigationCarhop,
    Profile,
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
<style lang="scss" scoped>
@import '~@/assets/scss/variables.scss';
.logout {
  float: right;
}
.buttons,
#dm-content-wrapper {
  margin-top: 2%;
  overflow-y: auto;
}
</style>
