<template>
  <div class="main-body color-dashboard-background color-text">
    <search />
    <div :class="['food-wrapper', subCategoryHendler ? 'active' : 'notActive']">
      <div class="food-top-arrow food-arrow" v-if="categories.length">
        <i class="fa fa-chevron-up" aria-hidden="true"></i>
      </div>
      <div class="food-bottom-arrow food-arrow" v-if="categories.length">
        <i class="fa fa-chevron-down" aria-hidden="true"></i>
      </div>
      <SubMenu v-if="subcategories.length" />
      <div v-else class="noSubCategory" />
      <div class="food-block">
        <Breadcrumbs />
        <div v-if="!categories.length" class="text-danger">
          {{ _t('Nothing found to order.') }}
        </div>
        <Items v-else />
      </div>
    </div>
  </div>
</template>

<script>
/* global */
//import { bus } from '@/eventBus'
import Items from './catalog/Items'
import Breadcrumbs from './catalog/Breadcrumbs'
import Search from './catalog/Search'
import SubMenu from './catalog/SubMenu'
import { mapGetters } from 'vuex'

export default {
  name: 'Catalog',
  props: {
    msg: String,
  },
  data() {
    return {
      foodBlockItemHeight: 0,
      foodBlockHeight: 0,
      foodBlockInitHeight: 0,
      foodCatItemHeight: 0,
      foodCatHeight: 0,
      foodCatInitHeight: 0,
    }
  },
  components: {
    Breadcrumbs,
    Items,
    Search,
    SubMenu,
  },
  mounted() {},
  methods: {},
  computed: {
    ...mapGetters(['subCategoryHendler']),
    ...mapGetters('category', ['categories', 'subcategories', 'items']),
    ...mapGetters('location', ['_t']),
  },
}
</script>
