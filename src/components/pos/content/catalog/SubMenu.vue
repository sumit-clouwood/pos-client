<template>
  <div class="food-categories" v-if="subcategories.length">
    <div
      class="food-categories-item"
      v-for="item in subcategories"
      :style="{
        background: item.sub_category_image == '' ? item.sub_category_color : ''
      }"
      :key="item._id"
      :class="{ active: currentSubcategory === item._id }"
      @click.prevent="getItems(item)"
    >
      <img
        v-if="item.sub_category_image != ''"
        class="food-categories-item-img"
        :src="item.sub_category_image"
        :alt="dt(item)"
      />
      <div class="food-categories-item-text" :title="dt(item)">
        {{ dt(item) }}
      </div>
      <div class="food-categories-item-check">
        <i class="fa fa-check" aria-hidden="true"></i>
      </div>
    </div>
  </div>
  <!--add class bg if image not found => class="food-categories-item bg"-->
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "SubMenu",
  props: {},
  computed: {
    ...mapState({
      currentSubcategory: state => state.category.subcategory._id
    }),
    ...mapGetters("category", ["subcategories"])
  },
  methods: {
    ...mapActions("category", ["getItems"])
  }
};
</script>
