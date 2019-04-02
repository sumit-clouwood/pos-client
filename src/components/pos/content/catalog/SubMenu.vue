<template>
  <div class="pizza-size-wrapper " v-if="subcategories.length">
    <div
      v-for="item in subcategories"
      :key="item._id"
      :class="{ active: currentSubcategory === item._id }"
      class="pos-size-bg"
    >
      <div @click.prevent="getItems(item)">
        <img
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
  },

  updated() {
    // $('.vegetable:has(img)').addClass('pos-item-bg')
    // $('.pizza-size-wrapper > div:has(img)').addClass('pos-size-bg')
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
