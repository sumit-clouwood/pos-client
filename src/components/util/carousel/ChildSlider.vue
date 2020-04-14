<template>
  <div class="carousel-container" ref="carousel">
    <div class="carousel">
      <transition name="slider">
        <ul
          :style="{ transform: 'translate3d(' + positionX + 'px, 0px, 0px)' }"
          @touchstart="startDrag"
          @touchmove="doDrag"
          @touchend="stopDrag"
          @mousedown="startDrag"
          @mousemove="doDrag"
        >
          <li
            :style="{
              width: slideWidth + 'px',
            }"
            @click="$emit('back')"
          >
            <div
              class="slide"
              :style="{
                width: slideWidth - 10 + 'px',
              }"
            >
              <img src="img/icons/backarrow.svg" />
              <label class="shorten-sentence" title="Back">
                Back
              </label>
            </div>
          </li>
          <li
            v-for="(slide, key) in slides"
            :key="key"
            :style="{
              width: slideWidth + 'px',
            }"
            @click.stop="selectSlide({ index: key, slide: slide })"
            :class="{
              active:
                currentKey === method.type
                  ? slide.name === method.name
                  : key === currentSlide,
            }"
          >
            <div
              class="slide"
              :style="{
                width: slideWidth - 10 + 'px',
              }"
            >
              <img :src="slide.icon" />
              <label class="shorten-sentence" :title="dt(slide)">
                {{ dt(slide) }}
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
import PaymentMethodsMixin from '@/mixins/PaymentMethods'
// import * as CONST from '@/constants'
export default {
  name: 'ChildSlider',
  mixins: [PaymentMethodsMixin],
  props: {
    currentKey: {
      type: String,
      default: 'card',
    },
  },
  data() {
    return {
      currentPage: 1,
      currentSlide: 0,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil((this.slides.length + 1) / this.perPage)
    },
    slideWidth() {
      return this.width / this.perPage
    },
  },
  mounted() {
    const selectedMethodType = this.method.type
    // Select first slide if no slide is selected and set it as a method type
    if (this.slides.length && selectedMethodType != this.slides[0].type) {
      this.selectSlide({ index: 0, slide: this.slides[0] })
      this.movePage(1)
    } else {
      if (selectedMethodType === this.slides[0].type) {
        this.currentSlide = this.slides.indexOf(this.method)
        // Needs to add +1 becasue we're showing back button as well
        this.movePage(Math.ceil((this.currentSlide + 1) / this.perPage))
      }
    }
    window.addEventListener('mouseup', this.stopDrag)
  },
  methods: {
    selectSlide({ index, slide }) {
      this.currentSlide = index
      this.$emit('selected-slide', { index: this.currentKey, slide: slide })
    },
    movePage(page) {
      if (this.totalPages === 1) return
      let toMove = (page - 1) * this.perPage * this.slideWidth
      if (page == this.totalPages) {
        //We're adding 1 in total length Because we are showing back button
        const slidesToAdjust = (this.slides.length + 1) % this.perPage
        if (slidesToAdjust > 0) {
          //that means last page has less slides than no of per page
          const missingSlides = this.perPage - slidesToAdjust
          toMove -= missingSlides * this.slideWidth
        }
      }

      this.positionX = -toMove
      this.currentPage = page
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.carousel-container {
  .carousel {
    transform: translate3d(0, 0, 0);
    position: relative;
    display: block;
    overflow: hidden;
    margin: 0;
    padding: 0;

    ul {
      opacity: 1;
      width: 2200px;
      transition: transform 0.9s ease-in-out;

      li {
        display: inline-block;
        text-align: center;
        min-height: 1px;
        height: 100%;
        @media only screen and (min-width: 961px) and (max-width: 1024px) {
          width: 102px !important;
        }
        .slide {
          border-radius: 3px;
          background-color: #ffffff;
          border: solid 1px #dbdfe9;
          cursor: pointer;
          justify-content: center;
          padding: 4px;
          @media only screen and (min-width: 961px) and (max-width: 1023px) {
            width: 94px !important;
          }
        }

        &.active {
          .slide {
            border: solid 2px #5056ca;
          }
        }
        img {
          width: 46px;
          height: 46px;
          display: block;
          margin: 0 auto;
          border-style: none;
        }

        label {
          display: block;
          cursor: pointer;
        }
      }
    }
  }
  .paging {
    display: block;
    justify-content: center;

    ul {
      width: 100%;
      padding: 0;
      margin: 0;
      list-style: none;
      text-align: center;

      li {
        display: inline-block;
        margin-right: 10px;
        button {
          font-size: 0;
          line-height: 0;
          display: block;
          width: 20px;
          height: 20px;
          padding: 5px;
          cursor: pointer;
          color: transparent;
          border: 0;
          outline: none;
          background: transparent;

          &.active {
            &:before {
              opacity: 0.75;
            }
          }
          &:before {
            font-size: 28px;
            line-height: 20px;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            content: '•';
            text-align: center;
            opacity: 0.25;
            color: black;
            -webkit-font-smoothing: antialiased;
          }
        }
      }
    }
  }
}
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
