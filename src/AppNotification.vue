<template>
  <div class="overlay" v-show="appUpdateNotification">
    <div class="app-notification">
      <span class="title">Application update is available.</span>
      <button class="button" @click="reloadWindow">UPDATE</button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'AppNotification',
  computed: {
    ...mapState('sync', ['modules', 'appUpdateNotification']),
  },
  methods: {
    reloadWindow() {
      localStorage.setItem('update_available', false)
      window.location.reload(true)
    },
    closeNotification() {
      this.$store.commit('sync/setAppUpdateNotification', false)
    },
  },
  created() {
    if (!this.appUpdateNotification) {
      this.$store.commit(
        'sync/setAppUpdateNotification',
        localStorage.getItem('update_available') === 'true' ? true : false
      )
    }
  },
}
</script>
<style lang="scss">
@import './assets/scss/style.scss';
</style>
<style lang="sass" scoped>
.overlay
  position: fixed
  width: 100%
  height: 100%
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: hsla(0, 0%, 48%, 0.68)
  z-index: 2
  cursor: pointer

.app-notification
  -webkit-font-smoothing: antialiased
  line-height: 100%
  letter-spacing: .2px
  -webkit-align-items: center
  align-items: center
  background-color: #202124
  border: none
  -webkit-border-radius: 4px
  border-radius: 4px
  bottom: 0
  -webkit-box-sizing: border-box
  box-sizing: border-box
  color: #fff
  display: -webkit-box
  display: -webkit-flex
  display: flex
  -webkit-flex-wrap: wrap
  flex-wrap: wrap
  font-weight: 400
  left: 0
  margin: 24px
  max-width: 640px
  min-height: 52px
  padding: 8px 24px
  padding-right: 24px
  position: fixed
  right: auto
  text-align: left
  top: auto
  white-space: normal
  z-index: 990
  .close
    align-items: center
    border: none
    display: inline-flex
    justify-content: center
    outline: none
    z-index: 0
    cursor: pointer
    position: absolute
    right: 16px
    top: 16px
    .btn
      height: 20px
      opacity: .54
      width: 20px
      opacity: .7
      background-image: url("/img/icons/close.png")
      background-position: center
      background-repeat: no-repeat
      background-size: 20px
    &:before
      content: ''
      display: block
      opacity: 0
      position: absolute
      transition-duration: .15s
      transition-timing-function: cubic-bezier(0.4,0.0,0.2,1)
      z-index: -1
      bottom: -10px
      left: -10px
      right: -10px
      top: -10px
      background: none
      border-radius: 50%
      box-sizing: border-box
      transform: scale(0)
      transition-property: transform,opacity
    &:after
      content: ''
      height: 200%
      position: absolute
      top: -50%
      left: -50%
      width: 200%
  .title
    padding-right: 28px

  .button
    align-items: center
    border: 1px solid
    display: inline-flex
    justify-content: center
    outline: none
    position: relative
    z-index: 0
    -webkit-font-smoothing: antialiased
    font-family: 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif
    font-size: .875rem
    letter-spacing: .25px
    background: none
    border-radius: 4px
    box-sizing: border-box
    color: #5f6368
    cursor: pointer
    font-weight: 500
    height: 36px
    outline: none
    color: #8ab4f8
    margin-left: 8px
    min-width: auto
    padding: 0 8px
    text-decoration: none
</style>
