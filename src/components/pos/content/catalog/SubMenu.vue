<template>
  <div class="pizza-size-wrapper" v-if="subcategories.length">
    <div
      v-for="item in subcategories"
      :key="item._id"
      :class="{ active: currentSubcategory === item._id }"
    >
      <div @click.prevent="getItems(item)">
        <img
          :src="subcategoryImage(item.sub_category_image)"
          :alt="t(item.subcategory_name).name"
        />
        <span>{{ t(item.subcategory_name).name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'SubMenu',
  props: {},
  computed: {
    ...mapState({
      subcategories: state => state.category.subcategories,
      currentSubcategory: state => state.category.subcategory._id
    }),
    ...mapGetters('category', ['subcategoryImage'])
  },
  methods: mapActions('category', ['getItems'])
};
</script>
<style scoped lang="scss">
.pizza-size-wrapper {
  img {
    width: 64px;
  }
}
</style>
