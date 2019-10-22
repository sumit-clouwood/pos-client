<template>
  <div
    class="content-wrapper"
    :style="{ 'background-image': 'url(' + bg + ')' }"
  >
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

  computed: {
    bg() {
      return this.$store.getters['location/bgImage'] || 'img/bg.jpg'
    },
  },
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
  user-select: none
  overflow: hidden
  height: 100vh
  background-repeat: no-repeat
  background-size: cover
  background-position: center center

  &.full-bg
    background-size: contain !important
    background-repeat: no-repeat
    background-position: center center

  div#popover_content_wrapper
    width: 23.3em
    margin-top: 1em
    display: none

  .admin-login-wrapper
    overflow:  hidden
    margin:  0 auto
    width:  100%
    background: rgba(33,33,33, 0.61)
    height: 100vh

    .login-wrapper
      width:  1180px
      max-width: 100%
      margin:  0 auto
</style>
