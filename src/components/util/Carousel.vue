<template>
  <div class="carousel-container" ref="carousel">
    <div class="carousel">
      <transition name="slider">
        <ul
          :style="{ transform: 'translate3d(' + positionX + 'px, 0px, 0px)' }"
        >
          <li
            v-for="(slide, key) in slides"
            :key="key"
            :class="{ active: key == currentSlide }"
            :style="{
              width: slideWidth + 'px',
            }"
            @click="selectSlide(key)"
            v-on:click="$emit('click', { index: key, slide: slide })"
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
  mounted() {},
  methods: {
    selectSlide(slideNo) {
      this.currentSlide = slideNo
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
      width: 1596px
      transition: transform 1.5s ease-in-out

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
