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
    <ul class="ullist-admin" v-if="cashiers.length">
      <carousel :perPageCustom="[[480, 3], [768, 6], [1024, 8]]">
        <slide v-for="cashier in cashiers" :key="cashier._id">
          <popper
            trigger="clickToOpen"
            :options="{
              placement: 'top',
              modifiers: { offset: { offset: '0,10px' } },
            }"
          >
            <lockpad></lockpad>
            <div slot="reference">
              <img
                @click.prevent="setCashier(cashier.email)"
                class="transform-img"
                :id="cashier._id"
                :src="cashier.avatar || 'img/profile/broccoli-profile.jpg'"
                alt="cashier.name"
              /><span>{{ cashier.name }}</span>
            </div>
          </popper>
        </slide>
      </carousel>
    </ul>
    <div v-else class="no-user">
      <div>No cashier found in store.</div>
      <router-link :to="store"> Back </router-link>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapState } from 'vuex'
import { Carousel, Slide } from 'vue-carousel'
import Popper from 'vue-popperjs'
import Lockpad from './Lockpad'

export default {
  name: 'Users',
  components: {
    Carousel,
    Slide,
    popper: Popper,
    Lockpad,
  },
  computed: {
    ...mapGetters('auth', ['cashiers']),
    ...mapState('auth', ['userDetails']),
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
      $('.ullist-admin .VueCarousel-slide > img').click(function() {
        $(this)
          .parent('li')
          .addClass('position-set')
          .siblings('.position-set')
          .removeClass('position-set')

        $('.position-set').append($('#popover_content_wrapper'))
        $('.position-set').append($('#absent-content'))
        $('#popover_content_wrapper').addClass('animated zoomIn')
        $('#popover_content_wrapper').show()
        $('#popover_content_wrapper #cashierpin').focus()
      })

      //$('.ullist-admin > li:first-child  > img').trigger('click')
      const jqElem = $('img#' + this.userDetails.item._id).parent('li')
      let jqLi = jqElem.next()
      if (!jqLi.length) {
        jqLi = jqElem.siblings('li:first')
      }
      // jqLi.find('img').trigger('click')
    },
  },
  mounted() {
    if (this.cashiers.length) {
      this.bindJquery()
    }
  },
}
</script>
<style>
.VueCarousel-inner {
  justify-content: center;
}
</style>
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

ul.ullist-admin
  margin: 0 auto
  text-align: center
  padding-top: 2em

  .VueCarousel-slide
    display: inline-block
    padding: 1em

    &:nth-child(2)
      > img
        &.transform
          width: 60%

    &.position-set
      position: relative
      display: flex
      flex-direction: column
      align-items: center

      >
        .transform
          display: block
          transition: all 1s ease-in-out


        .transform-scale
          display: none

      #popover_content_wrapper
        display: block !important

      > img
        width: 8em
        height: 8em
        transition: all 0.4s ease
        margin-bottom: 0em

    > img
      width: 7em
      height: 7em
      cursor: pointer
      margin-bottom: 0em
      transition: all 1s ease-in-out
      margin: 0 auto
      border-radius: 50%
      border: 4px solid rgba(255, 255, 255, 0.7)

      &:hover
        width: 8em
        height: 8em
        transition: all 0.6s ease
        margin-bottom: 0em

    > span
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
      padding-top: 0.5em;

  img
    &.transform
      display: none
      width: 75%
</style>
