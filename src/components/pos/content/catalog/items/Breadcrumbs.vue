<template>
  <div class="breadcrumb-category">
    <ul class="ullist-category">
      <li>
        <span>Selected Category</span>
        <p>{{ t(selectedCategory.cat_name).name }}</p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li>
        <span>Selected Sub Category</span>
        <p>{{ t(selectedSubCategory.subcategory_name).name }}</p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li>
        <span>Selected Item</span>
        <p>{{ selectedItem }}</p>
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
      selectedSubCategory: state => state.category.subcategory,
      selectedItem: state => state.category.item,
    }),
  },
}
</script>
