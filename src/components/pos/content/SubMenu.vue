<template>
  <div class="pizza-size-wrapper">
    <div class="active" v-for="item in subcategories" :key="item._id">
      <img :src="subcategoryImage(item.sub_category_image)" alt="t(item.subcategory_name).name"> 
      <span @click.prevent="getItems(item)"> {{ t(item.subcategory_name).name }}</span>
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
<style scoped lang="scss">
.pizza-size-wrapper {
  img {
    height: 80px;
    width: 80px;
  }
}
</style>
