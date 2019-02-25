<template>
  <div class="breadcrumb-category">
    <ul class="ullist-category">
      <li v-if="selectedCategory && selectedCategory.cat_name">
        <span>Selected Category</span>
        <p>{{ subtractString(t(selectedCategory.cat_name).name) }}</p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li v-if="selectedSubCategory && selectedSubCategory.subcategory_name">
        <span>Selected Sub Category</span>
        <p>
          {{ subtractString(t(selectedSubCategory.subcategory_name).name) }}
        </p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li v-if="selectedItem && selectedItem.item_name">
        <span>Selected Item</span>
        <p>{{ subtractString(t(selectedItem.item_name).name) }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Breadcrumbs",
  props: {
    msg: String
  },
  computed: {
    ...mapState({
      selectedCategory: state =>
        state.category.category ? state.category.category : false,
      selectedSubCategory: state =>
        state.category.subcategory ? state.category.subcategory : false,
      selectedItem: state => (state.order.item ? state.order.item : false)
    })
  },
  methods: {
    subtractString(label) {
      return label.substring(0, 15);
    }
  }
};
</script>
