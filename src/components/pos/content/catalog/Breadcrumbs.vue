<template>
  <div class="breadcrumb-category">
    <ul class="ullist-category">
      <li>
        <span>{{ _t('Category') }}</span>
        <p class="shorten_name" :title="category.name">{{ t(category) }}</p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li v-if="subcategory">
        <span>{{ _t('Sub Category Name') }}</span>
        <p class="shorten_name" :title="subcategory.sub_category">
          {{ t(subcategory) }}
        </p>
        <span class="arrows"
          ><img src="img/pos/right-arrow.png" alt="right-arrow"
        /></span>
      </li>
      <li v-if="item">
        <span>{{ _t('Item') }}</span>
        <p :title="t(item)" class="shorten_name">
          {{ t(item) }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Breadcrumbs',
  props: {
    msg: String,
  },
  computed: {
    ...mapState('category', ['category', 'subcategory', 'item']),
    ...mapGetters('location', ['_t']),
  },
}
</script>
<style scoped>
ul.ullist-category {
  width: 500px !important;
}
</style>
