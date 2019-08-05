<template>
  <div class="progress">
    <div
      class="progress-bar progressIncrement"
      role="progressbar"
      aria-valuenow="50"
      aria-valuemin="1"
      aria-valuemax="100"
      :style="{ width: range + '%' }"
    ></div>
  </div>
</template>
<script>
export default {
  name: 'Progress',
  data: function() {
    return {
      range: 1,
      interval: null,
    }
  },
  props: {
    initRange: Number,
    transitionFinish: Boolean,
  },
  mounted() {
    this.interval = setInterval(() => {
      this.range += 10
      if (this.range > 110) {
        this.range = 1
      }
      if (this.range >= 1000) {
        clearInterval(this.interval)
      }
    }, 1000)

    if (this.transitionFinished) {
      clearInterval(this.interval)
    }
  },
  destroyed() {
    clearInterval(this.interval)
  },
}
</script>
