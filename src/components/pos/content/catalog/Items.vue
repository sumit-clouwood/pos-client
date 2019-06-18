<template>
  <div class="food-menu">
    <div
      class="food-menu-item"
      v-for="item in items"
      :key="item._id"
      @click.prevent="addToOrder(item)"
    >
      <img
        class="food-menu-item-img"
        :src="item.image"
        :alt="dt(item)"
        @error="imageLoadError()"
      />
      <div class="food-menu-item-text">{{ dt(item) }}</div>
    </div>
    <Popup />
  </div>
</template>

<script>
/* global $, showModal  */

import { mapGetters } from 'vuex'

import Popup from './items/Popup'
export default {
  name: 'Items',
  props: {
    msg: String,
  },
  components: {
    Popup,
  },
  computed: {
    ...mapGetters('category', ['items']),
    ...mapGetters('modifier', ['hasModifiers']),
  },
  methods: {
    addToOrder(item) {
      this.$store.commit('category/SET_ITEM', item)
      this.$store.commit('checkoutForm/showCalc', true)
      this.$store.commit('orderForm/updateQuantity', 1)
      if (this.$store.getters['modifier/hasModifiers'](item)) {
        this.$store.dispatch('modifier/assignModifiersToItem', item)
        this.$store.commit('orderForm/clearSelection')
        showModal('#POSItemOptions')
      } else {
        this.$store.dispatch('order/addToOrder', item)
      }
    },
    IsImageOk(img) {
      // During the onload event, IE correctly identifies any images that
      // weren't downloaded as not complete. Others should too. Gecko-based
      // browsers act like NS4 in that they report this incorrectly.
      if (!img.complete) {
        return false
      }

      // However, they do have two very useful properties: naturalWidth and
      // naturalHeight. These give the true size of the image. If it failed
      // to load, either of these should be zero.
      if (typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0) {
        return false
      }

      // No other way of checking: assume it's ok.
      return true
    },

    imageLoadError() {
      // let myDoc = document.getElementsByClassName('.contain-body-class')
      /* myDoc = myDoc.remove('.sticky-footer')*/
      for (let i = 0; i < document.images.length; i++) {
        if (!this.IsImageOk(document.images[i])) {
          let hue = 'bg'
          /*'rgb(' +
            (Math.floor((256 - 199) * Math.random()) + 200) +
            ',' +
            (Math.floor((256 - 199) * Math.random()) + 200) +
            ',' +
            (Math.floor((256 - 199) * Math.random()) + 200) +
            ')'*/
          $(document.images[i])
            .closest('div.pos-item-bg')
            .addClass(hue)
          $(document.images[i])
            .siblings('p')
            .css('font-size', '15px')
          $(document.images[i])
            .closest('div.pos-size-bg')
            .addClass(hue)
          // .css('background-color', hue)
          $(document.images[i])
            .siblings('span')
            .css('font-weight', 'bold')
          document.images[i].remove()
        }
      }
    },
  },
}
</script>
<style lang="sass" scoped>
.pos-item-bg
  img
    max-width: 146px
</style>
