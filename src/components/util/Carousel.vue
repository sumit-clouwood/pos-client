<template>
  <div class="carousel-container" ref="carousel">
    <div class="carousel">
      <transition name="slider">
        <ul
          :style="{ transform: 'translate3d(' + positionX + 'px, 0px, 0px)' }"
          @mousedown="startDrag"
          @mousemove="doDrag"
          @mouseup="stopDrag"
        >
          <li
            v-for="(slide, key) in slides"
            :key="key"
            :class="{ active: key == currentSlide }"
            :style="{
              width: slideWidth + 'px',
            }"
            @click.stop=";[selectSlide({ index: key, slide: slide })]"
          >
            <div
              class="slide"
              :style="{
                width: slideWidth - 10 + 'px',
              }"
            >
              <img :src="slide.icon" />
              <label class="shorten-sentence" :title="slide.name">
                {{ slide.name }}
              </label>
            </div>
          </li>
        </ul>
      </transition>
    </div>
    <div class="paging">
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
    slides: Array,
    perPage: Number,
    width: Number,
  },
  data() {
    return {
      currentPage: 1,
      currentSlide: 0,
      positionX: 0,
      dragging: false,
      dragX: '',
      dragY: '',
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.slides.length / this.perPage)
    },
    slideWidth() {
      return this.width / this.perPage
    },
  },
  mounted() {
    window.addEventListener('mouseup', this.stopDrag)
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    selectSlide({ index, slide }) {
      this.currentSlide = index
      this.$emit('click', { index: index, slide: slide })
    },
    setActive(index) {
      this.currentSlide = index
    },
    movePage(page) {
      let toMove = (page - 1) * this.perPage * this.slideWidth

      if (page == this.totalPages) {
        //last page
        let noOfSlidesToMove = this.slides.length % this.perPage
        if (noOfSlidesToMove != 0) {
          toMove = (page - 1) * noOfSlidesToMove * this.slideWidth
        }
      }
      this.positionX = -toMove
      this.currentPage = page
    },
    startDrag(event) {
      event = event || window.event
      event.preventDefault()
      this.dragging = true
      this.x = this.y = 0
    },
    stopDrag(event) {
      event = event || window.event
      event.preventDefault()
      this.dragging = false
      this.x = this.y = ''
      document.onmouseup = null
      document.onmousemove = null
    },
    doDrag(event) {
      event = event || window.event
      event.preventDefault()
      if (this.dragging) {
        if (event.clientX > this.x) {
          //drag to right
          if (this.currentPage - 1 >= 1) {
            this.movePage(this.currentPage - 1)
          }
        } else if (event.clientX < this.x) {
          //drag to left
          if (this.currentPage + 1 <= this.totalPages) {
            this.movePage(this.currentPage + 1)
          }
        }
        this.x = event.clientX
        this.y = event.clientY
      }
    },
  },
}
</script>
<style lang="sass" scoped>
.carousel-container
  .carousel
    transform: translate3d(0, 0, 0)
    position: relative
    display: block
    overflow: hidden
    margin: 0
    padding: 0

    ul
      opacity: 1
      width: 2200px
      transition: transform 0.9s ease-in-out

      li
        display: inline-block
        text-align: center
        min-height: 1px
        height: 100%

        .slide
          border-radius: 3px
          background-color: #ffffff
          border: solid 1px #dbdfe9
          cursor: pointer
          justify-content: center
          padding: 4px

        &.active
          .slide
            border: solid 2px #5056ca

        img
          width: 46px
          height: 46px
          display: block
          margin: 0 auto
          vertical-align: middle
          border-style: none

        label
          display: block
          cursor: pointer

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
@import '../../assets/scss/pixels_rem.scss';
@import '../../assets/scss/variables.scss';
@import '../../assets/scss/mixins.scss';

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
