<template>
  <div class="main-body color-dashboard-background color-text">
    <search />
    <div :class="['food-wrapper', subCategoryHendler ? 'active' : 'notActive']">
      <div
        class="food-top-arrow food-arrow"
        v-if="categories.length"
        @click="foodTop"
      >
        <i class="fa fa-chevron-up" aria-hidden="true"></i>
      </div>
      <div
        class="food-bottom-arrow food-arrow"
        v-if="categories.length"
        @click="foodBottom"
      >
        <i class="fa fa-chevron-down" aria-hidden="true"></i>
      </div>
      <div
        class="food-cat-top-arrow food-arrow"
        v-if="subcategories.length"
        @click="foodCatTop"
      >
        <i class="fa fa-chevron-up" aria-hidden="true"></i>
      </div>
      <div
        class="food-cat-bottom-arrow food-arrow"
        v-if="subcategories.length"
        @click="foodCatBottom"
      >
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
/* global $ */
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
  updated() {
    this.setScreenScrolls()
  },
  mounted() {
    this.setScreenScrolls()
  },
  methods: {
    setScreenScrolls() {
      let foodBlockHeight = $('.food-block').innerHeight()
      let foodCatHeight = $('.foodCatScroll').innerHeight()
      this.foodBlockHeight = foodBlockHeight
      this.foodBlockInitHeight = foodBlockHeight
      this.foodCatHeight = foodCatHeight
      this.foodCatInitHeight = foodCatHeight
      this.foodBlockItemHeight = $('.food-menu').innerHeight()
      this.foodCatItemHeight = $('.food-categories').innerHeight()
      $(
        '.food-bottom-arrow, .food-top-arrow, .food-cat-bottom-arrow, .food-cat-top-arrow'
      ).removeClass('disable')
      if (this.foodBlockHeight > this.foodBlockItemHeight) {
        $('.food-bottom-arrow, .food-top-arrow').addClass('disable')
      }
      if (this.foodCatHeight > this.foodCatItemHeight) {
        $('.food-cat-bottom-arrow, .food-cat-top-arrow').addClass('disable')
      }
    },
    foodBottom() {
      //alert(this.foodBlockHeight + ' >> ' + this.foodBlockItemHeight)
      if (this.foodBlockHeight >= this.foodBlockItemHeight) {
        this.foodBlockHeight -= parseInt(this.foodBlockInitHeight)
        $('.food-bottom-arrow').addClass('disable')
        return false
      }
      $('.food-top-arrow').removeClass('disable')
      $('.food-block').animate({ scrollTop: this.foodBlockHeight }, 1000)
      this.foodBlockHeight += parseInt(this.foodBlockInitHeight)
    },
    foodTop() {
      //alert(this.foodBlockHeight + ' <> ' + this.foodBlockInitHeight)
      if (this.foodBlockHeight <= 0) {
        $('.food-top-arrow').addClass('disable')
        return false
      }
      this.foodBlockHeight -= parseInt(this.foodBlockInitHeight)
      $('.food-bottom-arrow').removeClass('disable')
      $('.food-block').animate({ scrollTop: this.foodBlockHeight }, 1000)
    },
    foodCatTop() {
      if (this.foodCatHeight <= 0) {
        $('.food-cat-top-arrow').addClass('disable')
        return false
      }
      this.foodCatHeight -= parseInt(this.foodCatInitHeight)
      $('.food-cat-bottom-arrow').removeClass('disable')
      $('.foodCatScroll').animate({ scrollTop: this.foodCatHeight }, 1000)
    },
    foodCatBottom() {
      if (this.foodCatHeight >= this.foodCatItemHeight) {
        this.foodCatHeight -= parseInt(this.foodCatInitHeight)
        $('.food-cat-bottom-arrow').addClass('disable')
        return false
      }
      $('.food-cat-top-arrow').removeClass('disable')
      $('.foodCatScroll').animate({ scrollTop: this.foodCatHeight }, 1000)
      this.foodCatHeight += parseInt(this.foodCatInitHeight)
    },
  },
  computed: {
    ...mapGetters(['subCategoryHendler']),
    ...mapGetters('category', ['categories', 'subcategories', 'items']),
    ...mapGetters('location', ['_t']),
  },
}
</script>
