<template>
  <div class="header color-text-invert color-dashboard-background">
    <div class="header-main">
      <Topbar />
      <TopRightMenu />
    </div>
  </div>
</template>

<script>
import Topbar from '@/components/carhop/header/Topbar'
import TopRightMenu from '@/components/pos/header/TopNavRight'

export default {
  name: 'Header',
  props: {},
  components: {
    Topbar,
    TopRightMenu,
  },
}
</script>
