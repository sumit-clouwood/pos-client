<template>
  <div class="content-wrapper" :style="screenStyles" v-if="!loggedIn">
    <div class="admin-login-wrapper" :style="screenWrapperStyle">
      <div class="login-wrapper">
        <div class="store-info">
          <ul class="ullist-admin">
            <li data-placement="above">
              <div class="img transform-img">
                <div
                  class="bgimg"
                  :style="'background-image:url(' + logo + ')'"
                ></div>
              </div>
              <span>{{ store }}</span>
            </li>
          </ul>
        </div>
        <div id="popover_content_wrapper">
          <lockpad></lockpad>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import dateTime from '@/components/mobileComponents/mobileElements/dateTime.vue'
import Lockpad from './Lockpad.vue'
import { mapState } from 'vuex'

export default {
  name: 'cashierList',
  data() {
    return {
      userPin: [],
      userKey: null,
    }
  },

  computed: {
    screenStyles() {
      if (this.bg) {
        return { 'background-image': 'url(' + this.bg + ')' }
      }
      return { 'background-color': 'rgb(81 154 252)' }
    },
    screenWrapperStyle() {
      if (this.bg) {
        return { 'background-color': 'rgba(25, 25, 25, 0.85)' }
      }
      return { 'background-color': 'rgb(81 154 252)' }
    },
    bg() {
      return this.$store.getters['location/bgImage'] || false
    },
    ...mapState({
      brand: state => (state.location.brand ? state.location.brand.name : null),
      logo: state =>
        state.location.brand && state.location.brand.company_logo
          ? state.location.brand.company_logo
          : 'https://d3jjfdwi6rnqlf.cloudfront.net/img/icons/apple-touch-icon-120x120.png',
      store: state => (state.location.store ? state.location.store.name : null),
      address: state =>
        state.location.store
          ? state.location.store.address + ', ' + state.location.store.city
          : null,
    }),
    loggedIn() {
      return this.$store.state.auth.token
    },
  },
  components: {
    Lockpad,
  },
  methods: {},
  mounted() {},
}
</script>

<style lang="sass" scoped>
.bgimg
    height: 100%
    width: 100%
    border-radius: 50%
    background-repeat: no-repeat
    background-position: center
    background-size: cover
    transition: all 1s ease-in-out
    position: absolute
.data
  cursor: pointer
  font-size: 18px
  font-weight: 600
  font-style: normal
  font-stretch: normal
  line-height: normal
  letter-spacing: 1px
  color: #ffffff
  display: block
  position: relative

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

  .store-info
    margin: 30px auto !important
    text-align: center

  div#popover_content_wrapper, .store-info
    width: 326px
    margin-top: 1em
    margin: 0 auto
    top: 300px

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

ul.ullist-admin
  margin: 0 auto
  text-align: center
  padding-top: 2em

  > li
    display: inline-block
    padding: 2px 0

    &:nth-child(2)
      > .img
        &.transform
          width: 60%

    &.position-set
      position: relative
      display: flex
      flex-direction: column
      align-items: center

      >
        .transform
          display: block
          transition: all 1s ease-in-out


        .transform-scale
          display: none

      #popover_content_wrapper
        display: block !important

      > .img
        width: 8em
        height: 8em
        transition: all 0.4s ease
        margin-bottom: 0em

    > .img
      width: 7em
      height: 7em
      cursor: pointer
      margin-bottom: 0em
      transition: all 1s ease-in-out
      margin: 0 auto
      border-radius: 50%
      border: 4px solid rgba(255, 255, 255, 0.7)
      position: relative

      &:hover
        width: 8em
        height: 8em
        transition: all 0.6s ease
        margin-bottom: 0em

        .bgimg
          transition: all 0.6s ease
    > span
      cursor: pointer
      font-size: 18px
      font-weight: 600
      font-style: normal
      font-stretch: normal
      line-height: normal
      letter-spacing: 0.7px
      color: #ffffff
      display: block
      position: relative
      padding-top: 0.5em;

  .img
    &.transform
      display: none
      width: 75%
</style>
