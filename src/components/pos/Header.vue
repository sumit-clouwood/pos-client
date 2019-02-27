<template>
  <div class="pos-header">
    <TopNavLeft></TopNavLeft>
    <TopNavRight></TopNavRight>
  </div>
</template>

<script>
import TopNavLeft from './header/TopNavLeft'
import TopNavRight from './header/TopNavRight'

export default {
  name: 'Header',
  props: {},
  components: {
    TopNavLeft,
    TopNavRight,
  },
}
</script>
