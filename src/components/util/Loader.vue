<template>
  <div id="overlay" class="fade-in" v-show="loadingData">
    <div class="spinner"></div>
    <br />
    <h3>{{ _t(status) }}...</h3>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Loader',
  props: {
    status: {
      type: String,
      default: 'LOADING',
    },
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('sync', ['loadingData']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
#overlay {
  background: white;
  color: black;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 5000;
  top: 0;
  left: 0;
  float: left;
  text-align: center;
  padding-top: 25%;
  opacity: 0.8;
}
button {
  margin: $px40;
  padding: $px5 $px20;
  cursor: pointer;
}
.spinner {
  margin: 0 auto;
  height: $px64;
  width: $px64;
  animation: rotate 0.8s infinite linear;
  border: $px5 solid red;
  border-right-color: transparent;
  border-radius: 50%;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
