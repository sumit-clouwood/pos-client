<template>
  <div class="preloader">
    <link rel="prefetch" href="./../../../static/preloader.gif" />
    <img src="./../../../static/preloader.gif" />
  </div>
</template>
<script>
export default {
  name: 'Preloader',
}
</script>
<style lang="sass" scoped>
.preloader
    text-align: center
    img
        height: 120px;
</style>
