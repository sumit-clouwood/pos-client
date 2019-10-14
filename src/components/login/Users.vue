<template>
  <ul class="ullist-admin">
    <li data-placement="above" v-for="cashier in cashiers" :key="cashier._id">
      <img
        @click.prevent="setCashier(cashier.email)"
        class="transform-img"
        :src="cashier.avatar || 'img/profile/broccoli-profile.jpg'"
        alt="cashier.name"
      /><span>{{ cashier.name }}</span>
    </li>
  </ul>
</template>

<script>
/* global $ */
import { mapState } from 'vuex'

export default {
  name: 'Users',
  computed: {
    ...mapState('auth', ['cashiers']),
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
      $('.ullist-admin > li > img').click(function() {
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
      $('.ullist-admin > li:first-child  > img').trigger('click')
    },
  },
  mounted() {
    if (this.cashiers.length) {
      this.bindJquery()
    }
  },
}
</script>

<style lang="sass" scoped>

ul.ullist-admin
  margin: 0 auto
  text-align: center
  padding-top: 5px

  > li
    display: inline-block
    padding: 50px 0

    &:nth-child(2)
      > img
        &.transform
          width: 60%

    &.position-set
      position: relative

      >
        .transform
          display: block
          transition: all 1s ease-in-out


        .transform-scale
          display: none

      #popover_content_wrapper
        display: block !important

      > img
        -webkit-transform: scale(0.7, 0.7)
        -moz-transform: scale(0.7, 0.7)
        -o-transform: scale(0.7, 0.7)
        -ms-transform: scale(0.7, 0.7)
        transform: scale(0.7, 0.7)
        transition: all 0.4s ease
        margin-bottom: 15px

    > img
      cursor: pointer
      -webkit-transform: scale(0.5, 0.5)
      -moz-transform: scale(0.5, 0.5)
      -o-transform: scale(0.5, 0.5)
      -ms-transform: scale(0.5, 0.5)
      transform: scale(0.5, 0.5)
      margin-bottom: 15px
      transition: all 1s ease-in-out
      margin: 0 auto
      border-radius: 50%
      border: 4px solid rgba(255, 255, 255, 0.7)

      &:hover
        -webkit-transform: scale(0.7, 0.7)
        -moz-transform: scale(0.7, 0.7)
        -o-transform: scale(0.7, 0.7)
        -ms-transform: scale(0.7, 0.7)
        transform: scale(0.7, 0.7)
        transition: all 0.6s ease
        margin-bottom: 15px

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
      top: -40px

  img
    &.transform
      display: none
      width: 75%
</style>
