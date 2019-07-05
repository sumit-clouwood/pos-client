<template>
  <div class="main-body">
    <search />
    <div class="food-wrapper">
      <SubMenu />
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
  components: {
    Breadcrumbs,
    Items,
    Search,
    SubMenu,
  },
  computed: {
    ...mapGetters('category', ['categories', 'subcategories', 'items']),
    ...mapGetters('location', ['_t']),
  },
}
</script>
