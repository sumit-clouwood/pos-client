<template>
  <div>
    <div class="scroll-top-arrow food-arrow disable" @click="btnTop">
      <i class="fa fa-chevron-up" aria-hidden="true"></i>
    </div>
    <div class="scroll-bottom-arrow food-arrow disable" @click="btnBottom">
      <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
  </div>
</template>
<script>
/* global $ */
export default {
  name: 'ScrollButtons',
  props: { containerId: String, scrollTo: String },
  data() {
    return {
      scrollBlockHeight: 0,
      scrollBlockInitHeight: 0,
      scrollBlockItemHeight: 0,
      scrollPosition: 0,
    }
  },
  /*updated() {
    let scroll_height = $('#' + this.containerId)[0].scrollHeight
    let height_ = $('#' + this.containerId).height()
    if (scroll_height > height_) {
      $('.scroll-top-arrow, .scroll-bottom-arrow').removeClass('disable')
    } else {
      $('.scroll-top-arrow, .scroll-bottom-arrow').addClass('disable')
    }
  },*/
  methods: {
    areaCalculation(operation) {
      this.scrollBlockHeight = $('#' + this.containerId)[0].scrollHeight
      this.scrollBlockItemHeight = $(
        '#' + this.containerId + ' > div'
      ).innerHeight()
      // if (this.scrollBlockHeight < 255 && operation === 'init') {
      //   $('.scroll-top-arrow, .scroll-bottom-arrow').addClass('disable')
      // }
      if (operation === 'top') {
        this.scrollPosition = this.scrollBlockItemHeight
      }
      if (
        operation === '-' &&
        this.scrollPosition >= this.scrollBlockItemHeight
      ) {
        this.scrollPosition += this.scrollBlockItemHeight - 20
      }
      if (
        operation === '+' &&
        this.scrollPosition >= this.scrollBlockItemHeight
      ) {
        this.scrollPosition -= this.scrollBlockItemHeight - 20
      }
    },
    btnTop() {
      // eslint-disable-next-line no-console
      // console.log(this.scrollPosition, '', this.scrollBlockItemHeight)
      if (this.scrollPosition <= this.scrollBlockItemHeight) {
        this.areaCalculation('top')
        $('.scroll-top-arrow').addClass('disable')
        $('.scroll-bottom-arrow').removeClass('disable')
      } else {
        this.areaCalculation('+')
        $('.scroll-top-arrow').removeClass('disable')
        $('.scroll-bottom-arrow').removeClass('disable')
        document.getElementById(this.containerId).scrollTop -= parseInt(
          this.scrollTo
        )
      }
    },
    btnBottom() {
      $('.scroll-top-arrow').removeClass('disable')
      if (
        this.scrollBlockHeight != 0 &&
        this.scrollPosition >= this.scrollBlockHeight
      ) {
        $('.scroll-top-arrow').removeClass('disable')
        $('.scroll-bottom-arrow').addClass('disable')
      } else {
        $('.scroll-top-arrow').removeClass('disable')
        document.getElementById(this.containerId).scrollTop += parseInt(
          this.scrollTo
        )
        this.areaCalculation('-')
      }
    },
  },
}
</script>
<style>
.food-arrow.disable {
  display: none;
}
.food-arrow.scroll-top-arrow {
  top: 60px;
  right: 30px;
}
.food-arrow.scroll-bottom-arrow {
  bottom: 80px;
  right: 30px;
}
.disable {
  display: none;
}
</style>
