<template>
  <div>
    <div class="headwrap">
      <div class="head">
        <div class="search">
          <span class="fa fa-search"></span>
          <input
            type="text"
            v-model="searchKeyword"
            placeholder="Search Cashier"
          />
        </div>
      </div>
    </div>
    <div v-if="cashiers.length" class="users-slider">
      <slider
        class="slider"
        :perPage="5"
        :arrows="true"
        :responsive="[
          { screen: 480, perPage: 1 },
          { screen: 600, perPage: 2 },
          { screen: 900, perPage: 3 },
          { screen: 1124, perPage: 4 },
        ]"
      >
        <slide
          v-for="cashier in cashiers"
          :key="cashier._id"
          class="slide"
          :class="{ 'position-set': cashier.email === cashierEmail }"
        >
          <img
            :src="
              cashier.avatar ||
                'https://d3jjfdwi6rnqlf.cloudfront.net/img/profile/default_avatar.jpg'
            "
            @click.prevent="setCashier(cashier.email)"
            @touchend.prevent="setCashier(cashier.email)"
            class="transform-img"
            alt="cashier.name"
            :id="cashier._id"
          />
          <span class="data">{{ cashier.name }}</span>
        </slide>
      </slider>
      <div id="popover_content_wrapper">
        <lockpad></lockpad>
      </div>
    </div>
    <div v-else class="no-user">
      <div>No cashier found in store.</div>
      <router-link :to="store"> Back </router-link>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapState } from 'vuex'
import Slider from '@/components/util/carousel/Slider.vue'
import Slide from '@/components/util/carousel/Slide.vue'
import Lockpad from './Lockpad.vue'

export default {
  name: 'Users',
  components: {
    Slider,
    Slide,
    Lockpad,
  },
  computed: {
    ...mapGetters('auth', ['cashiers']),
    ...mapState('auth', ['userDetails', 'cashierEmail']),
    searchKeyword: {
      get() {
        return this.$store.state.auth.searchKeyword
      },
      set(value) {
        this.$store.commit('auth/setSearchKeyword', value)
      },
    },
  },
  data() {
    return {
      jQuery: false,
    }
  },
  props: {
    params: Object,
  },
  watch: {
    cashiers(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.jQuery = false
          this.bindJquery()
        })
      }
    },
  },
  methods: {
    setCashier(email) {
      this.$store.commit('auth/SET_CASHIER_EMAIL', email)
    },
    bindJquery() {
      if (this.jQuery) {
        return true
      }
      this.jQuery = true
      $('img.transform-img').bind('click touchstart', function() {
        $('.position-set').removeClass('position-set')
        $('#popover_content_wrapper').hide()
        $(this)
          .parent()
          .parent()
          .parent()
          .addClass('position-set')
        setTimeout(() => {
          const slideWidth = $('.position-set').outerWidth()
          const slideLeft = $('.position-set').offset().left
          const calcWidth = $('#popover_content_wrapper').outerWidth()
          const diff = (calcWidth - slideWidth) / 2
          let lockLeft = slideLeft - diff
          if (lockLeft <= 3) {
            lockLeft = 4
          }
          $('#popover_content_wrapper').css('left', lockLeft + 'px')
          const sliderWidth = $('.users-slider').outerWidth()
          let lockRight = lockLeft + calcWidth

          if (lockRight > sliderWidth && lockRight > window.innerWidth) {
            $('#popover_content_wrapper').css(
              'left',
              sliderWidth - calcWidth - 4 + 'px'
            )
          }
        }, 100)

        $('#popover_content_wrapper').addClass('animated zoomIn')
        $('#popover_content_wrapper').show()
        //$('#popover_content_wrapper #cashierpin').focus()
      })

      ////$('.ullist-admin > li:first-child  > img').trigger('click')
      let jqElem = $('img#' + this.userDetails.item._id)
      if (!jqElem.length) {
        jqElem = $('img.transform-img:first')
      }
      // let slide = jqElem
      //   .parent()
      //   .parent()
      //   .parent()

      // if (slide.next().length) {
      //   slide = slide.next()
      // } else {
      //   slide = slide.siblings(':first')
      // }
      //slide.addClass('position-set')
      //slide.find('img.transform-img').trigger('click')
      jqElem.trigger('click')
    },
    hideCalc() {},
  },
  mounted() {
    if (this.cashiers.length) {
      this.bindJquery()
    }
    window.addEventListener('mouseup', this.hideCalc)
  },
}
</script>
<style lang="scss" scoped>
.no-user {
  text-align: center;
  padding-top: 30px;
  color: #fff;
}

.headwrap {
  width: 100%;
  .head {
    width: 70%;
    margin: 0 auto;
    margin: 0 auto;

    .search {
      margin-top: 30px;
      height: 40px;
      line-height: 40px;
      width: 100%;
      position: relative;
      color: #757575;
      display: inline-block;

      input {
        color: #757575;
        width: 100%;
        height: 40px;
        background: #fcfcfc;
        border: 1px solid #aaa;
        border-radius: 5px;
        box-shadow: 0 0 3px #ccc, 0 10px 15px #ebebeb inset;
        padding-right: 30px;
        padding-left: 10px;
        box-sizing: border-box;

        &:focus {
          outline: none;
        }
      }
      .fa-search {
        position: absolute;
        top: 10px;
        right: 10px;

        &:before {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
<style lang="sass" scoped>
#popover_content_wrapper
  width: 326px
  position: absolute

$initzoom: 0.6
$scalezoom: 0.8
$imgmaxw: 140px
$imgmaxh: 140px

.slider
  margin: 0 auto
  text-align: center

  height: 180px

  padding-top: 5px

  .slide
    img
      max-width: $imgmaxw
      max-height: $imgmaxh
      min-height: 140px
      min-width: 140px
      height: auto
      width: auto

      cursor: pointer
      -webkit-transform: scale($initzoom, $initzoom)
      -moz-transform: scale($initzoom, $initzoom)
      -o-transform: scale($initzoom, $initzoom)
      -ms-transform: scale($initzoom, $initzoom)
      transform: scale($initzoom, $initzoom)
      margin-bottom: 15px
      transition: all 1s ease-in-out
      margin: 0 auto
      border-radius: 50%
      border: 4px solid rgba(255, 255, 255, 0.7)

      &:hover
        -webkit-transform: scale($scalezoom, $scalezoom)
        -moz-transform: scale($scalezoom, $scalezoom)
        -o-transform: scale($scalezoom, $scalezoom)
        -ms-transform: scale($scalezoom, $scalezoom)
        transform: scale($scalezoom, $scalezoom)
        transition: all 0.6s ease
        margin-bottom: 15px

    span.data
      cursor: pointer
      font-size: 18px
      font-weight: 600
      font-style: normal
      font-stretch: normal
      line-height: normal
      letter-spacing: 0.7px
      color: #ffffff
      display: block
      position: relative
      top: -21px

    &:nth-child(2)
      > img
        &.transform
          width: 60%

    &.position-set
      position: relative


      .transform
        display: block
        transition: all 1s ease-in-out


      .transform-scale
        display: none


      img
        -webkit-transform: scale($scalezoom, $scalezoom)
        -moz-transform: scale($scalezoom, $scalezoom)
        -o-transform: scale($scalezoom, $scalezoom)
        -ms-transform: scale($scalezoom, $scalezoom)
        transform: scale($scalezoom, $scalezoom)
        transition: all 0.4s ease
        margin-bottom: 15px


  img
    &.transform
      display: none
      width: 75%
</style>
