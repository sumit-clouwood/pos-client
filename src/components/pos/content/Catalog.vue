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
import { bus } from '@/eventBus'
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
    this.$nextTick(() => {
      this.setScreenScrolls()
    })
  },
  mounted() {
    this.setScreenScrolls()
    bus.$on('heights', payLoad => {
      this.setCurrentHeights(payLoad)
      this.setScreenScrolls()
    })
  },
  methods: {
    setCurrentHeights(currentItems) {
      this.foodBlockHeight = currentItems.foodBlockHeight
      this.foodBlockInitHeight = currentItems.foodBlockInitHeight
      this.foodBlockItemHeight = currentItems.foodBlockItemHeight
    },
    setScreenScrolls() {
      if (
        !this.foodBlockHeight &&
        !this.foodBlockInitHeight &&
        !this.foodBlockItemHeight
      ) {
        let foodBlockHeight = $('.food-block').innerHeight()
        let foodMenuItemHeight = $('.food-menu').innerHeight()
        this.foodBlockHeight = foodBlockHeight
        this.foodBlockInitHeight = foodBlockHeight
        this.foodBlockItemHeight = foodMenuItemHeight
      }

      let foodCatHeight = $('.foodCatScroll').innerHeight()
      let foodCatItemHeight = $('.food-categories').innerHeight()
      this.foodCatHeight = foodCatHeight
      this.foodCatInitHeight = foodCatHeight
      this.foodCatItemHeight = foodCatItemHeight

      $(
        '.food-bottom-arrow, .food-top-arrow, .food-cat-bottom-arrow, .food-cat-top-arrow'
      ).removeClass('disable')
      if (this.foodBlockHeight > this.foodBlockItemHeight) {
        $('.food-bottom-arrow, .food-top-arrow').addClass('disable')
      }
      if (this.foodCatHeight > this.foodCatItemHeight) {
        $('.food-cat-bottom-arrow, .food-cat-top-arrow').addClass('disable')
      }
      $('.food-block').animate({ scrollTop: 0 }, 1000)
    },
    foodBottom() {
      if (this.foodBlockHeight >= this.foodBlockItemHeight) {
        this.foodBlockHeight = parseInt(this.foodBlockItemHeight)
        return false
      } else {
        $('.food-top-arrow').removeClass('disable')
        if (
          this.foodBlockHeight === this.foodBlockInitHeight ||
          this.foodBlockHeight === 0
        ) {
          this.foodBlockHeight += parseInt(
            $('.food-menu-item').innerHeight() - 100
          )
        } else {
          this.foodBlockHeight += parseInt(this.foodBlockInitHeight)
        }
      }
      $('.food-block').animate({ scrollTop: this.foodBlockHeight }, 1000)

      if (this.foodBlockHeight >= this.foodBlockItemHeight) {
        this.foodBlockHeight = parseInt(this.foodBlockItemHeight)
        return false
      }
    },
    foodTop() {
      if (
        this.foodBlockHeight <= 0 ||
        this.foodBlockHeight === this.foodBlockInitHeight
      ) {
        this.foodBlockHeight = parseInt(this.foodBlockInitHeight)
        return false
      } else {
        $('.food-bottom-arrow').removeClass('disable')
        if (this.foodBlockHeight === this.foodBlockItemHeight) {
          this.foodBlockHeight -= parseInt(this.foodBlockInitHeight + 100)
        } else {
          this.foodBlockHeight -= parseInt(this.foodBlockInitHeight)
        }
      }
      $('.food-block').animate({ scrollTop: this.foodBlockHeight }, 1000)

      if (
        this.foodBlockHeight <= 0 ||
        this.foodBlockHeight === this.foodBlockInitHeight
      ) {
        this.foodBlockHeight = parseInt(this.foodBlockInitHeight)
        return false
      }
    },
    //      Foo categories
    foodCatTop() {
      if (
        this.foodCatHeight <= 0 ||
        this.foodCatHeight === this.foodCatInitHeight
      ) {
        this.foodCatHeight = parseInt(this.foodCatInitHeight)
        return false
      } else {
        $('.food-cat-bottom-arrow').removeClass('disable')
        if (this.foodCatHeight === this.foodCatItemHeight) {
          this.foodCatHeight -= parseInt(this.foodCatInitHeight + 100)
        } else {
          this.foodCatHeight -= parseInt(this.foodCatInitHeight)
        }
      }
      $('.foodCatScroll').animate({ scrollTop: this.foodCatHeight }, 1000)

      if (
        this.foodCatHeight <= 0 ||
        this.foodCatHeight === this.foodCatInitHeight
      ) {
        this.foodCatHeight = parseInt(this.foodCatInitHeight)
        return false
      }
    },
    foodCatBottom() {
      if (this.foodCatHeight >= this.foodBlockItemHeight) {
        this.foodCatHeight = parseInt(this.foodBlockItemHeight)
        return false
      } else {
        $('.food-cat-top-arrow').removeClass('disable')
        if (
          this.foodCatHeight == this.foodCatInitHeight ||
          this.foodCatHeight === 0
        ) {
          this.foodCatHeight += parseInt(this.foodCatInitHeight - 100)
        } else {
          this.foodCatHeight += parseInt(this.foodCatInitHeight)
        }
      }

      $('.foodCatScroll').animate({ scrollTop: this.foodCatHeight }, 1000)

      if (this.foodCatHeight >= this.foodCatItemHeight) {
        this.foodCatHeight = parseInt(this.foodCatItemHeight)
        return false
      }
    },
  },
  computed: {
    ...mapGetters(['subCategoryHendler']),
    ...mapGetters('category', ['categories', 'subcategories', 'items']),
    ...mapGetters('location', ['_t']),
  },
}
</script>
