<template>
  <div
    class="carousel-container"
    :class="{
      'has-arrows': arrows,
      left: this.currentPage > 1,
      right: this.currentPage < this.totalPages,
    }"
    ref="container"
    :style="{ 'padding-left': arrows ? arrowWidth / 2 + 'px' : 0 }"
    @click.stop="moveSlide"
  >
    <div
      class="carousel"
      ref="containerchild"
      :style="{ width: this.containerWidth - this.arrowWidth + 'px' }"
    >
      <transition name="slider">
        <div
          :style="{ transform: 'translate3d(' + positionX + 'px, 0px, 0px)' }"
          @mousedown="startDrag"
          @mousemove="doDrag"
          ref="carousel"
        >
          <slot></slot>
        </div>
      </transition>
    </div>
    <div class="paging" v-if="dots || showDots">
      <ul>
        <li v-for="page in totalPages" :key="page">
          <button
            :id="page"
            :class="{ active: page == currentPage }"
            @click="movePage(page)"
          >
            {{ page }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Carousel',
  props: {
    perPage: Number,
    dots: Boolean,
    arrows: Boolean,
  },
  data() {
    return {
      slideTotal: '',
      slideWidth: '',
      currentPage: 1,
      positionX: 0,
      dragging: false,
      dragX: '',
      dragY: '',
      containerWidth: 0,
      showDots: false,
    }
  },
  computed: {
    arrowWidth() {
      if (this.arrows) {
        return 48
      }
      return 0
    },

    totalPages() {
      return Math.ceil(this.slideTotal / this.perPage)
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.slider()
    })
    window.addEventListener('mouseup', this.stopDrag)
  },
  updated() {
    this.$nextTick(() => {
      this.slider()
    })
  },
  methods: {
    slider() {
      this.slideTotal = this.$refs.carousel.children.length
      this.containerWidth = this.$refs.container.clientWidth
      this.slideWidth = (this.containerWidth - this.arrowWidth) / this.perPage
      if (this.slideTotal < this.perPage) {
        this.slideWidth =
          (this.containerWidth - this.arrowWidth) / this.slideTotal
      }
      if (!this.dots && !this.arrows) {
        this.showDots = true
      }
    },
    moveSlide(event) {
      // eslint-disable-next-line no-console
      if (
        event.pageX > this.$refs.container.offsetLeft - this.arrowWidth / 2 &&
        event.pageX <= this.$refs.container.offsetLeft + this.arrowWidth / 2
      ) {
        //move left
        if (this.currentPage > 1) {
          this.movePage(this.currentPage - 1)
        }
      } else if (
        event.pageX >
          this.$refs.container.offsetLeft +
            this.$refs.container.offsetWidth -
            this.arrowWidth / 2 &&
        event.pageX <=
          this.$refs.container.offsetLeft +
            this.$refs.container.offsetWidth +
            this.arrowWidth / 2
      ) {
        //move right
        if (this.currentPage < this.totalPages) {
          this.movePage(this.currentPage + 1)
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    movePage(page) {
      let toMove = (page - 1) * this.perPage * this.slideWidth

      if (page == this.totalPages) {
        //last page
        let noOfSlidesToMove =
          this.$refs.carousel.children.length % this.perPage
        if (noOfSlidesToMove != 0) {
          toMove -= (this.perPage - noOfSlidesToMove) * this.slideWidth
        }
      }
      this.positionX = -toMove
      this.currentPage = page
    },
    startDrag(event) {
      event = event || window.event
      event.preventDefault()
      this.dragging = true
      this.x = event.clientX
      this.y = event.clientY
      this.dx = event.clientX
      this.dy = event.clientY
    },
    stopDrag(event) {
      event = event || window.event
      event.preventDefault()
      if (this.dragging) {
        if (event.clientX < this.x) {
          //drag to left, move right
          if (this.currentPage + 1 <= this.totalPages) {
            this.movePage(this.currentPage + 1)
          }
        } else if (event.clientX > this.x) {
          //drag to right, move right
          if (this.currentPage - 1 >= 1) {
            this.movePage(this.currentPage - 1)
          }
        }
        this.dragging = false
        // this.x = event.clientX
        //this.y = event.clientY
      }

      document.onmousemove = null
    },
    doDrag(event) {
      event = event || window.event
      event.preventDefault()

      if (this.dragging) {
        if (event.clientX < this.dx) {
          //drag to left, move right
          //this.positionX -= 10
        } else if (event.clientX > this.dx) {
          //drag to right, move right
          //this.positionX += 10
        }
        this.dx = event.clientX
        this.dy = event.clientY
      }
    },
  },
}
</script>
<style lang="sass" scoped>
.carousel-container
  width: 100%
  height: 100%
  position: relative

  &.has-arrows
    cursor: pointer

    &.left
      &:before
        opacity: 0.8

    &.right
      &:after
        opacity: 0.8

    &:before, &:after
      opacity: 0
      border: solid transparent
      content: " "
      height: 0
      width: 0
      position: absolute
      pointer-events: none
      border-width: 20px
      top: calc(50% - 20px)
      cursor: pointer

    &:before
      left: -24px
      border-color: rgba(194, 225, 245, 0)
      border-right-color: #c2e1f5
      transform: rotate(0deg)
      -webkit-transform: rotate(0deg)

    &:after
      border-color: rgba(136, 183, 213, 0)
      border-right-color: #88b7d5
      transform: rotate(180deg)
      -webkit-transform: rotate(180deg)
      right: -24px


  .carousel
    transform: translate3d(0, 0, 0)
    position: relative
    display: block
    overflow: hidden
    margin: 0
    padding: 0
    height: 100%

    > div
      display: flex
      opacity: 1
      width: 2200px
      height: 100%
      transition: transform 0.9s ease-in-out



  .paging
    display: block
    justify-content: center

    ul
      width: 100%
      padding: 0
      margin: 0
      list-style: none
      text-align: center

      li
        display: inline-block
        margin-right: 10px

        button
          font-size: 0
          line-height: 0
          display: block
          width: 20px
          height: 20px
          padding: 5px
          cursor: pointer
          color: transparent
          border: 0
          outline: none
          background: transparent

          &.active
            &:before
              opacity: .75;

          &:before
            font-size: 28px
            line-height: 20px
            top: 0
            left: 0
            width: 20px
            height: 20px
            content: '•'
            text-align: center
            opacity: .25
            color: black
            -webkit-font-smoothing: antialiased
</style>

<style lang="scss">
@import '../../../assets/scss/pixels_rem.scss';
@import '../../../assets/scss/variables.scss';
@import '../../../assets/scss/mixins.scss';

@include responsive(mobile) {
  .mobile-payment-methods .pay-body #payment-method {
    > div {
      img {
        margin: 0 !important;
      }
    }
    .paging {
      display: none;
    }
    ul {
      width: 100%;
      display: grid;
      grid-template-rows: 1fr;
      grid-row-gap: 1em;
      li {
        width: 100% !important;
        .slide {
          width: 100% !important;
          display: flex;
          justify-content: left;
          flex-direction: row;
          label {
            align-self: center;
            padding-left: 2em;
          }
        }
      }
    }
    .carousel-container {
      .carousel {
        overflow: inherit;
      }
    }
  }
}
</style>
