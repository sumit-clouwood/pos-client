<template>
  <div class="items vegetable-pizza-wrapper">
    <!--Added Breadcrumb here-->
    <Breadcrumbs />
    <div class="vegetable-pizza-block">
      <div class="vegetable-pizza">
        <div
          class="vegetable pos-item-bg"
          v-for="item in items"
          :key="item._id"
          @click.prevent="addToOrder(item)"
        >
          <div>
            <img
              :src="itemImage(item.item_image)"
              :alt="item.name"
              @error="imageLoadError(item.name.replace(/ /g, ''))"
              :class="item.name.replace(/ /g, '')"
            />
            <p class="remove-bottom popover-btn">
              {{ item.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <Popup />
  </div>
</template>

<script>
/* global $, showModal  */

import { mapGetters } from 'vuex'

import Breadcrumbs from './items/Breadcrumbs'
import Popup from './items/Popup'
export default {
  name: 'Items',
  props: {
    msg: String,
  },
  components: {
    Breadcrumbs,
    Popup,
  },
  computed: {
    ...mapGetters('category', ['items', 'itemImage']),
    ...mapGetters('modifier', ['hasModifiers']),
  },
  methods: {
    addToOrder(item) {
      this.$store.commit('category/SET_ITEM', item)

      if (this.$store.getters['modifier/hasModifiers'](item)) {
        this.$store.dispatch('modifier/setModifierItem', item)
        this.$store.commit('orderForm/clearSelection')
        this.$store.commit('orderForm/setItemId', item._id)
        this.$store.commit('orderForm/setUpdate', false)
        showModal('#POSItemOptions')
      } else {
        this.$store.dispatch('order/addToOrder', item)
      }
    },
    imageLoadError(className) {
      $(this)
        .find('.popover-btn')
        .attr('style', 'font-size:17px')

      $('img.' + className).remove()
      /*$('div.vegetable:not(.pos-item-bg) p.remove-bottom, .pizza-size-wrapper > div:not(.pos-size-bg)').each(function() {
        let hue = 'rgb(' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ')'
        $(this).css('background-color', hue)
      })*/
    },
  },
}
</script>
