<template>
  <div class="breadcrumb-category">
    <ul class="ullist-category">
      <li>
        <span>Selected Category</span>
        <p class="shorten_name" :title="category.name">{{ category.name }}</p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li v-if="subcategory">
        <span>Selected Sub Category </span>
        <p class="shorten_name" :title="subcategory.sub_category">
          {{ subcategory.name }}
        </p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li v-if="item">
        <span>Selected Item</span>
        <p :title="item.name" class="shorten_name">
          {{ item.name }}
        </p>
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
    ...mapState('category', ['category', 'subcategory', 'item']),
  },
}
</script>
<style scoped>
ul.ullist-category {
  width: 500px !important;
}
</style>
