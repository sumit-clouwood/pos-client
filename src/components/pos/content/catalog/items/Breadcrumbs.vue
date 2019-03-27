<template>
  <div class="breadcrumb-category">
    <ul class="ullist-category">
      <li v-if="selectedCategory && selectedCategory.cat_name">
        <span>Selected Category</span>
        <p>{{ subtractString(selectedCategory.name) }}</p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li v-if="selectedSubCategory && selectedSubCategory.subcategory_name">
        <span>Selected Sub Category</span>
        <p>
          {{ subtractString(selectedSubCategory.name) }}
        </p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li v-if="selectedItem && selectedItem.name">
        <span>Selected Item</span>
        <p>{{ selectedItem.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Breadcrumbs',
  props: {
    msg: String,
  },
  computed: {
    ...mapGetters('category', [
      'selectedCategory',
      'selectedSubCategory',
      'selectedItem',
    ]),
  },
  methods: {
    subtractString(label) {
      return label.substring(0, 15)
    },
  },
}
</script>
<style scoped>
ul.ullist-category {
  width: 500px !important;
}
</style>
