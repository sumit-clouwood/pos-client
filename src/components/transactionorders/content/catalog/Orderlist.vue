<template>
  <div
    v-if="subcategories && subcategories.length"
    :class="[
      '',
      subCategoryHendler ? 'foodCatigoriesActive' : 'foodCatigoriesNotActive',
    ]"
  >
    <div :class="['']" v-if="subcategories.length">
      <h1>Dummy Content</h1>
      <h1>Dummy Content</h1>
      <h1>Dummy Content</h1>
      <h1>Dummy Content</h1>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SubMenu',
  props: {},
  computed: {
    ...mapState({
      currentSubcategory: state => state.category.subcategory._id,
    }),
    ...mapGetters('category', ['subcategories']),
    ...mapGetters(['subCategoryHendler', 'foodMenuHendler']),
  },
  methods: {
    getSubCatItems(item) {
      // eslint-disable-next-line no-undef
      $('.breadcrumbs').show()
      // eslint-disable-next-line no-undef
      $('.search-field-input').val('')
      this.$store.dispatch('category/getItems', item)
    },
    // ...mapActions('category', ['getItems']),
  },
}
</script>
