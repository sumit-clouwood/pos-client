<template>
  <div class="pizza-size-wrapper " v-if="subcategories.length">
    <div
      v-for="item in subcategories"
      :key="item._id"
      :class="{ active: currentSubcategory === item._id }"
      class="subcategory pos-size-bg"
    >
      <div @click.prevent="getItems(item)">
        <img :src="item.sub_category_image" :alt="item.name" />
        <span class="cat-name shorten_name" :title="item.name">
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'SubMenu',
  props: {},
  computed: {
    ...mapState({
      currentSubcategory: state => state.category.subcategory._id,
    }),
    ...mapGetters('category', ['subcategories']),
  },
  methods: {
    ...mapActions('category', ['getItems']),
  },
}
</script>
<style lang="sass" scoped>
.cat-name
  font-size: smaller

.pizza-size-wrapper
  img
    width: 64px
    height: 64px
</style>
