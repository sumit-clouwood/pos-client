<template>
  <div class="content-wrapper">
    <div class="admin-login-wrapper">
      <div class="login-wrapper">
        <users></users>
        <div id="popover_content_wrapper">
          <!-- Modal content-->
          <lockpad></lockpad>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import dateTime from '@/components/mobileComponents/mobileElements/dateTime.vue'
import Lockpad from './Lockpad'
import Users from './Users'

export default {
  name: 'cashierList',
  data() {
    return {
      userPin: [],
      userKey: null,
    }
  },
  computed: {},
  components: {
    Users,
    Lockpad,
  },
  methods: {},
  mounted() {},
}
</script>

<style lang="sass" scoped>
.content-wrapper
  overflow: hidden
  height: 100vh
  background: url(~@/assets/images/mask@2x.jpg)
  background-repeat: no-repeat
  background-size: cover
  background-position: center center

  &.full-bg
    background-size: contain !important
    background: #000 url(~@/assets/images/mask@2xy.jpg)
    background-repeat: no-repeat
    background-position: center center

  div#popover_content_wrapper
    width: 365px
    position: absolute
    left: -70px
    right: 8px
    top: 295px
    display: none
</style>
