<template>
  <div class="pizza-size-wrapper " v-if="subcategories.length">
    <div
      v-for="item in subcategories"
      :key="item._id"
      :class="{ active: currentSubcategory === item._id }"
    >
      <div @click.prevent="getItems(item)">
        <img
          @error="imageLoadError(item.name.replace(/ /g, ''))"
          :class="item.name.replace(/ /g, '')"
          :src="subcategoryImage(item.sub_category_image)"
          :alt="item.name"
        />
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'SubMenu',
  props: {},
  computed: {
    ...mapState({
      currentSubcategory: state => state.category.subcategory._id,
    }),
    ...mapGetters('category', ['subcategoryImage', 'subcategories']),
  },
  methods: {
    ...mapActions('category', ['getItems']),
    imageLoadError(className) {
      $('img.' + className).remove()
      let hue =
        'rgb(' +
        (Math.floor((256 - 199) * Math.random()) + 200) +
        ',' +
        (Math.floor((256 - 199) * Math.random()) + 200) +
        ',' +
        (Math.floor((256 - 199) * Math.random()) + 200) +
        ')'
      $(
        'div.vegetable:not(.pos-item-bg) p.remove-bottom, .pizza-size-wrapper > div:not(.pos-size-bg)'
      ).each(function() {
        $(this).css('background-color', hue)
      })
    },
  },

  updated() {
    $('.vegetable:has(img)').addClass('pos-item-bg')
    $('.pizza-size-wrapper > div:has(img)').addClass('pos-size-bg')
  },
}
</script>
<style scoped lang="scss">
.pizza-size-wrapper {
  img {
    width: 64px;
  }
}
</style>
