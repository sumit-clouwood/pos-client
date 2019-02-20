<template>
  <div class="breadcrumb-category">
    <ul class="ullist-category">
      <li>
        <span>Selected Category</span>
        <p>{{ t(selectedCategory.cat_name).name.substring(0, 15) }}</p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li v-if="selectedSubCategory">
        <span>Selected Sub Category</span>
        <p>
          {{ t(selectedSubCategory.subcategory_name).name.substring(0, 15) }}
        </p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li v-if="selectedItem">
        <span>Selected Item</span>
        <p>{{ t(selectedItem.item_name).name.substring(0, 15) }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Breadcrumbs',
  props: {
    msg: String,
  },
  computed: {
    ...mapState({
      selectedCategory: state => state.category.category,
      selectedSubCategory: state =>
        state.category.subcategory ? state.category.subcategory : false,
      selectedItem: state => (state.order.item ? state.order.item : false),
    }),
  },
}
</script>
