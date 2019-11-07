<template>
  <div
    :style="{ width: slideWidth + 'px' }"
    @click="selectSlide()"
    @touchend="selectSlide()"
  >
    <div :style="{ width: slideWidth + 'px' }">
      <div :style="{ width: slideWidth - 10 + 'px' }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Slide',
  props: {},
  data() {
    return {
      slideWidth: 0,
      arrowWidth: 0,
      slidesInPage: 0,
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.$parent.responsive.forEach(res => {
        if (!this.slidesInPage && this.$parent.$el.clientWidth <= res.screen) {
          this.slidesInPage = res.perPage
        }
      })

      if (!this.slidesInPage) {
        this.slidesInPage = this.$parent.perPage
      }

      this.slideWidth =
        (this.$parent.$el.clientWidth - this.$parent.arrowWidth) /
        this.slidesInPage
    })
  },

  methods: {
    // eslint-disable-next-line no-unused-vars
    selectSlide() {
      this.$emit('click')
      this.$emit('touchend')
    },
  },
}
</script>
<style lang="sass" scoped>
.slide-slot
  display: inline-block
  text-align: center
  min-height: 1px
  height: 100%
  padding-right: 10px

  &:last-child
    padding-right: 0

  .slide
    cursor: pointer
    justify-content: center
    height: 100%
    > div
      height: 100%
</style>
