<template>
  <div class="breadcrumbs">
    <div class="breadcrumbs-item breadcrumbs-category">
      <div class="title-box">
        <div class="breadcrumbs-subtitle">{{ _t('Category') }}</div>
        <div class="breadcrumbs-title" :title="category">
          {{ dt(category) }}
        </div>
      </div>
      <img
        class="breadcrumbs-img"
        src="img/pos/right-arrow.png"
        alt="right-arrow"
      />
    </div>
    <div class="breadcrumbs-item breadcrumbs-sub-category" v-if="subcategory">
      <div class="title-box">
        <div class="breadcrumbs-subtitle">{{ _t('Sub Category Name') }}</div>
        <div class="breadcrumbs-title" :title="subcategory">
          {{ dt(subcategory) }}
        </div>
      </div>
      <img
        class="breadcrumbs-img"
        src="img/pos/right-arrow.png"
        alt="right-arrow"
      />
    </div>
    <div class="breadcrumbs-item breadcrumbs-menu" v-if="item">
      <div class="title-box">
        <div class="breadcrumbs-subtitle">{{ _t('Item') }}</div>
        <div class="breadcrumbs-title" :title="item">{{ dt(item) }}</div>
      </div>
    </div>
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
/*ul.ullist-category {
  width: 500px !important;
}*/
</style>
