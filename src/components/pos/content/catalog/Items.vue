<template>
  <!--Added Breadcrumb here-->
  <div class="vegetable-pizza-block">
    <div class="vegetable-pizza">
      <div
        class="vegetable pos-item-bg"
        v-for="item in items"
        :key="item._id"
        @click.prevent="addToOrder(item)"
      >
        <div>
          <img :src="item.image" :alt="item.name" @error="imageLoadError()" />
          <p class="remove-bottom popover-btn" :title="item.name">
            {{ item.name }}
          </p>
        </div>
      </div>
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
          let hue =
            'rgb(' +
            (Math.floor((256 - 199) * Math.random()) + 200) +
            ',' +
            (Math.floor((256 - 199) * Math.random()) + 200) +
            ',' +
            (Math.floor((256 - 199) * Math.random()) + 200) +
            ')'
          $(document.images[i])
            .closest('div.pos-item-bg')
            .css('background-color', hue)
          $(document.images[i])
            .siblings('p')
            .css('font-size', '15px')
          $(document.images[i])
            .closest('div.pos-size-bg')
            .css('background-color', hue)
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
