<template>
  <div class="contain-body-class">
    <DispatchScreen />
  </div>
</template>

<script>
/* global $ */
import DispatchScreen from '@/components/DispatchScreen'
export default {
  name: 'DispatchScreenInit',
  components: {
    DispatchScreen,
  },
  mounted() {
    /*$('body').removeAttr('class')
    $('body').attr('class', 'fixed-nav sticky-footer bg-dark dispatch-screen')*/
  },
  methods: {
    toggleFullScreen: function() {
      if (
        !document.fullscreenElement && // alternative standard method
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen()
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen()
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen()
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          )
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      }
    },
  },
  updated() {
    let ds = this
    $('.dp-zoom-scren').click(function(e) {
      e.preventDefault()
      ds.toggleFullScreen()
      $(this).hide()
      $('ul.ullist-dp li.dp-btn-exit').css('display', 'inline-block')
      $('#dp-content-wrapper').addClass('service-manager-overlay')
      $('.sticky-footer').addClass('sticky-header-overlay')

      $('header').css({ height: 'unset', position: 'unset', width: 'unset' })
    })
    $('.dp-btn-exit').click(function(e) {
      e.preventDefault()
      ds.toggleFullScreen()
      $(this).hide()
      $('.dp-zoom-scren').show()
      $('#dp-content-wrapper').removeClass('service-manager-overlay')
      $('.sticky-footer').removeClass('sticky-header-overlay')
      $('.middle-content.service-manager-content').css('margin-top', '0')
    })

    $('.dp-next-btn').click(function() {
      $('.block1-wrap-dp').hide()
      $('div.block1-wrap-dp#hide-block1-dp').show()
    })
    $('.dp-prev-btn').click(function() {
      $('.block1-wrap-dp').show()
      $('div.block1-wrap-dp#hide-block1-dp').hide()
    })
  },
}
</script>

<style lang="scss">
/*@import '../assets/sass/dispatchScreen';*/
</style>
