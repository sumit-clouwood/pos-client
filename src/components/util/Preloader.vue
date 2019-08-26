<template>
  <div class="preloader">
    <link rel="prefetch" href="/pos/img/icons/apple-touch-icon.png" />
    <div>
      <img src="img/pos/DimsLogo.gif" id="slidecaption" />
    </div>
    <div v-if="msg">{{ msg }}</div>
  </div>
</template>
<script>
export default {
  name: 'Preloader',
  props: {
    msg: String,
  },
}
</script>
<style lang="scss" scoped>
.preloader {
  margin-top: 0 !important;
  text-align: center;
  display: grid;
  align-items: start;
  align-content: start;
  justify-content: center;
  img {
    width: 100%;
  }
}
</style>
<!--style lang="stylus">
 img
            height: 310px
            margin-bottom: -50px
            width: 100%
            /*-webkit-animation-name: spinner*/
            /*-webkit-animation-timing-function: linear*/
            /*-webkit-animation-iteration-count: infinite*/
            /*-webkit-animation-duration: 2s*/
            /*animation-name: spinner*/
            /*animation-timing-function: linear*/
            /*animation-iteration-count: infinite*/
            /*animation-duration: 2s*/
            /*-webkit-transform-style: preserve-3d*/
            /*-moz-transform-style: preserve-3d*/
            /*-ms-transform-style: preserve-3d*/
            /*transform-style: preserve-3d*/

    @-webkit-keyframes spinner
        from
            -webkit-transform: rotateY(0deg)
        to
            -webkit-transform: rotateY(-360deg)
/*@keyframes spinner
  from
    -moz-transform: rotateY(0deg)
    -ms-transform: rotateY(0deg)
    transform: rotateY(0deg)
   to
    -moz-transform: rotateY(-360deg)
    -ms-transform: rotateY(-360deg)
    transform: rotateY(-360deg)*/
</!--style -->
