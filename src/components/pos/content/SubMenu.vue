<template>
  <div class="pizza-size-wrapper">
    <div class="active" v-for="item in subcategories" :key="item._id">
      <img src="img/pos/pizza-slice.png" alt="pizza"> 
      <span>Pizza Slice</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'SubMenu',
  props: {},
  computed: {
    ...mapState({
        subcategories: state => state.category.subcategories,
    }),
    ...mapGetters('category', [
        'subcategoryImage'
    ])
},

methods: mapActions('category', [
    'getItems'
]),
}
</script>