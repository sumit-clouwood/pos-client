<template>
  <div
    class="carousel-container"
    ref="carousel"
    v-if="!show && !showAggregator"
  >
    <div class="carousel">
      <transition name="slider">
        <ul
          :style="{ transform: 'translate3d(' + positionX + 'px, 0px, 0px)' }"
          @mousedown="startDrag"
          @mousemove="doDrag"
          @mouseup="stopDrag"
        >
          <template>
            <li
              v-if="
                selectedValue.length && selectedValue[0].type === 'aggregator'
              "
              :style="{
                width: slideWidth + 'px',
              }"
              @click="close()"
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
            <template v-for="[currentKey, value] of Object.entries(slides)">
              <li
                v-if="currentKey === 'aggregator'"
                :key="currentKey"
                :class="{ active: currentKey == currentSlide }"
                :style="{
                  width: slideWidth + 'px',
                }"
              >
                <div
                  class="slide"
                  :style="{
                    width: slideWidth - 10 + 'px',
                  }"
                  @click="reCallSelf({ showAggregator, value })"
                >
                  <img :src="imagePath(currentKey, value)" />
                  <label class="shorten-sentence" :title="currentKey">
                    {{ currentKey }}
                  </label>
                </div>
              </li>

              <li
                v-else-if="value.length === 1"
                :key="currentKey"
                :class="{ active: currentKey == currentSlide }"
                :style="{
                  width: slideWidth + 'px',
                }"
              >
                <div
                  @click.stop="
                    selectSlide({ index: currentKey, slide: value[0] })
                  "
                  class="slide"
                  :style="{
                    width: slideWidth - 10 + 'px',
                  }"
                >
                  <img :src="value[0].icon" />
                  <label class="shorten-sentence" :title="value[0].name">
                    {{ value[0].name }}
                  </label>
                </div>
              </li>
              <li
                v-else
                :key="currentKey"
                :class="{ active: currentKey == currentSlide }"
                :style="{
                  width: slideWidth + 'px',
                }"
              >
                <div
                  class="slide"
                  :style="{
                    width: slideWidth - 10 + 'px',
                  }"
                  @click="showChildSlides({ show, value, currentKey })"
                >
                  <img
                    :src="
                      value[0].type != 'aggregator'
                        ? imagePath(currentKey)
                        : fetchImage(value[0])
                    "
                  />
                  <label class="shorten-sentence" :title="currentKey">
                    {{ currentKey }}
                  </label>
                </div>
              </li>
            </template>
          </template>
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
  <carousel
    v-else-if="!show && showAggregator"
    ref="paymentmethods"
    :slides="aggregatorValues"
    :perPage="4"
    :width="456"
    @click="selectSlide"
  ></carousel>
  <child-slider
    v-else
    ref="paymentmethods"
    :slides="selectedValue"
    :perPage="4"
    :width="456"
    :currentKey="currentKey"
    @selected-slide="selectSlide"
    @back="show = !show"
  ></child-slider>
</template>
<script>
import ChildSlider from './carousel/ChildSlider'
import PaymentMethodsMixin from '@/mixins/PaymentMethods'
export default {
  name: 'Carousel',
  mixins: [PaymentMethodsMixin],
  components: {
    ChildSlider,
  },
  data() {
    return {
      show: false,
      selectedValue: [],
      currentKey: '',
      showAggregator: false,
      aggregatorValues: {},
    }
  },
  methods: {
    imagePath(key) {
      return 'img/icons/svgs/' + key + '.svg'
    },
    showChildSlides(payLoad) {
      this.show = !payLoad.show
      this.showAggregator = false
      this.selectedValue = payLoad.value
      this.currentKey = payLoad.currentKey
    },
    // eslint-disable-next-line no-unused-vars
    selectSlide({ index, slide }) {
      this.currentSlide = index
      this.$emit('click', { index: index, slide: slide })
      this.show = false
      this.showAggregator = false
    },
    fetchImage(method) {
      return this.$store.getters['payment/findAggregateGroup'](
        method.payment_type_group
      )['icon']
    },
    reCallSelf(payLoad) {
      this.show = false
      this.showAggregator = true
      this.aggregatorValues = payLoad.value[0]
    },
    close() {
      this.currentSlide = ''
      this.$emit('click', { index: '', slide: {} })
      this.show = false
      this.showAggregator = false
    },
  },
}
</script>
<style lang="scss">
@import '../../assets/scss/pixels_rem.scss';
@import '../../assets/scss/variables.scss';
@import '../../assets/scss/mixins.scss';
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

        .slide {
          border-radius: 3px;
          background-color: #ffffff;
          border: solid 1px #dbdfe9;
          cursor: pointer;
          justify-content: center;
          padding: 4px;
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
