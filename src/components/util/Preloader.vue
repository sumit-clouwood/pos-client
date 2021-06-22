<template>
  <div class="preloader">
    <link rel="prefetch" href="/pos/img/icons/apple-touch-icon.png" />
    <div>
      <!--      <img src="img/pos/DimsLogo.gif" id="slidecaption" />-->
      <img
        src="https://dm-cdn-stg.s3.ap-south-1.amazonaws.com/DimsLogo.gif"
        alt=""
        id="slidecaption"
      />
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
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.preloader {
  text-align: center;
  display: grid;
  align-items: start;
  align-content: start;
  justify-content: center;

  img {
    width: 100%;
  }
}

@include responsive(mobile) {
  .preloader {
    /*margin-top: 35% !important;*/
  }
}
</style>
