<template>
  <div class="catalog col-md-8 left-container">
    <search />
    <div class="row">
      <SubMenu v-if="all.length" />
      <Items v-if="all.length" />
    </div>
  </div>
</template>

<script>
import Items from './catalog/Items'
import Search from './catalog/Search'
import SubMenu from './catalog/SubMenu'
import { mapState } from 'vuex'

export default {
  name: 'Catalog',
  props: {
    msg: String,
  },
  components: {
    Items,
    Search,
    SubMenu,
  },
  computed: {
    ...mapState('category', ['all']),
  },
}
</script>
