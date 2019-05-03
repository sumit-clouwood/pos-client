<template>
  <div class="catalog col-md-8 left-container">
    <search />
    <div class="row">
      <SubMenu v-if="subcategories.length" />
      <div class="items vegetable-pizza-wrapper">
        <Breadcrumbs />
        <Items v-if="items.length" />
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
    ...mapGetters('category', ['subcategories', 'items']),
  },
}
</script>
