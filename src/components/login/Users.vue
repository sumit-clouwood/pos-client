<template>
  <div>
    <div class="headwrap">
      <div class="head">
        <div class="search">
          <span class="fa fa-search"></span>
          <input type="text" v-model="searchKeyword" />
        </div>
      </div>
    </div>
    <div v-if="cashiers.length">
      <slider class="slider" :perPage="4" :arrows="true">
        <slide
          v-for="cashier in cashiers"
          :key="cashier._id"
          class="slide"
          :class="{ 'position-set': cashier.email === cashierEmail }"
        >
          <img
            :src="cashier.avatar || 'img/profile/broccoli-profile.jpg'"
            @click.prevent="setCashier(cashier.email)"
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
      $('img.transform-img').click(function() {
        $('.position-set').removeClass('position-set')
        $('#popover_content_wrapper').hide()
        $(this)
          .parent()
          .parent()
          .parent()
          .addClass('position-set')

        $('#popover_content_wrapper').css({
          left: $('.position-set').offset().left - 25 + 'px',
        })
        $('#popover_content_wrapper').addClass('animated zoomIn')
        $('#popover_content_wrapper').show()
        $('#popover_content_wrapper #cashierpin').focus()
      })

      ////$('.ullist-admin > li:first-child  > img').trigger('click')
      const jqElem = $('img#' + this.userDetails.item._id).parent()
      let jqLi = jqElem.next()
      if (!jqLi.length) {
        jqLi = jqElem.siblings(':first')
      }
      jqLi.find('img').trigger('click')
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
