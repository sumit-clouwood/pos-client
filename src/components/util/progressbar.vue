<template>
  <div class="progressbar">
    <div class="bar" :style="{ width: position + '%' }"></div>
  </div>
</template>
<script>
export default {
  name: 'Progress',
  data: function() {
    return {
      position: 1,
      timeout: null,
    }
  },
  props: {
    init: Number,
    step: Number,
    interval: Number,
    range: Number,
  },
  mounted() {
    this.$nextTick(() => {
      this.ticker()
    })
  },
  updated() {
    this.$nextTick(() => {
      this.ticker()
    })
  },
  methods: {
    ticker() {
      if (!this.position) {
        this.position = this.init
      }

      this.timeout = setInterval(() => {
        // eslint-disable-next-line no-console

        this.position += this.step
        if (this.position > this.range + 1) {
          this.position = 1
        }
        if (this.position > 10000) {
          clearInterval(this.timeout)
        }
      }, this.interval)
    },
  },
  destroyed() {
    clearInterval(this.timeout)
  },
}
</script>
<style lang="sass" scoped>
.progressbar
  display: flex
  height: 6px
  overflow: hidden
  font-size: .75rem
  background-color: #e9ecef


  .bar
    display: flex
    flex-direction: column
    justify-content: center
    color: #fff
    text-align: center
    background-color: #007bff
    transition: width .6s ease
</style>
