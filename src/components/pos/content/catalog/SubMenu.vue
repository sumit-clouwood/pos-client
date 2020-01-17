<template>
  <div style="overflow-y: scroll;" class="foodCatScroll">
    <div
      v-if="subcategories && subcategories.length"
      :class="[
        'food-categories-wrapper',
        subCategoryHendler ? 'foodCatigoriesActive' : 'foodCatigoriesNotActive',
      ]"
    >
      <!--<btnBack :param="'subcategory'" />-->
      <div :class="['food-categories']" v-if="subcategories.length">
        <div
          class="food-categories-item box-shadow-selected"
          v-for="item in subcategories"
          :style="{
            background:
              item.sub_category_image == '' ? item.sub_category_color : '',
          }"
          :key="item._id"
          :class="{ active: currentSubcategory === item._id }"
          @click.prevent="getSubCatItems(item)"
          @click="getScrollButtons"
        >
          <img
            v-if="item.sub_category_image != ''"
            class="food-categories-item-img"
            :src="item.sub_category_image"
            :alt="dt(item)"
          />
          <div class="food-categories-item-text" :title="dt(item)">
            {{ dt(item) }}
          </div>
          <div class="food-categories-item-check color-dashboard-background">
            <i class="fa fa-check color-text-invert" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </div>
    <!--add class bg if image not found => class="food-categories-item bg"-->
    <div
      class="color-dashboard-background"
      v-if="!subcategories.length && !items.length"
      :class="[
        'food-categories-wrapper',
        subCategoryHendler ? 'foodCatigoriesActive' : 'foodCatigoriesNotActive',
      ]"
    >
      <!--<btnBack :param="'item'" />-->
      <div class="no_item"><h2>No menu item found</h2></div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters } from 'vuex'
// import btnBack from '../../../mobileComponents/mobileElements/btnBack'

export default {
  name: 'SubMenu',
  data() {
    return {
      foodBlockItemHeight: 0,
      foodBlockHeight: 0,
      foodBlockInitHeight: 0,
    }
  },
  components: {
    // btnBack,
  },
  props: {},
  created() {
    this.$store.dispatch('showMainCategory')
  },
  computed: {
    ...mapState({
      currentSubcategory: state => state.category.subcategory._id,
    }),
    ...mapGetters('category', ['subcategories', 'items']),
    ...mapGetters(['subCategoryHendler', 'foodMenuHendler']),
  },
  updated() {
    this.setScreenScrolls()
  },
  mounted() {
    this.setScreenScrolls()
  },
  methods: {
    getSubCatItems(item) {
      // eslint-disable-next-line no-undef
      $('.breadcrumbs').show()
      // eslint-disable-next-line no-undef
      $('.search-field-input').val('')
      this.$store.dispatch('category/getItems', item)
      this.$store.dispatch('foodMenuHendlerChange')
    },
    setScreenScrolls() {
      let foodBlockHeight = $('.food-block').innerHeight()
      this.foodBlockHeight = foodBlockHeight
      this.foodBlockInitHeight = foodBlockHeight
      this.foodBlockItemHeight = $('.food-menu').innerHeight()
      $('.food-bottom-arrow, .food-top-arrow').removeClass('disable')
      if (this.foodBlockHeight > this.foodBlockItemHeight) {
        $('.food-bottom-arrow, .food-top-arrow').addClass('disable')
      }
    },
    // ...mapActions('category', ['getItems']),
  },
}
</script>
<style lang="scss" scoped>
@import '../../../../assets/scss/pixels_rem.scss';
@import '../../../../assets/scss/variables.scss';
@import '../../../../assets/scss/mixins.scss';

@include responsive(mobile) {
  .food-categories-wrapper {
    grid-template-columns: 1fr;
    height: 100%;
    overflow: auto;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    background-color: transparent;

    &.foodCatigoriesActive {
      transition: 0.7s ease-out;
      top: 0;
    }

    &.foodCatigoriesNotActive {
      transition: 0.7s ease-out;
      top: -100%;
    }

    .food-categories {
      padding: 0;
      grid-gap: 0;
      overflow: auto;

      .food-categories-item {
        display: grid;
        align-items: center;
        width: auto;
        height: 50px;
        border-radius: 0;
        border: none;
        padding: 0 10px 0 10px;
        min-height: 4em;
        grid-template-columns: 65px 1fr;
        grid-gap: 20px;
        border-bottom: 1px solid $gray-middle;
        background-color: #fafafa;
        /*background: linear-gradient(*/
        /*  141deg,*/
        /*  #fcfcff 0%,*/
        /*  #d7e0e1 51%,*/
        /*  #ecebeb 75%*/
        /*);*/

        .food-categories-item-text {
          font-size: 14px;
          text-align: left;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        img {
          margin: 0;
          width: 3em;
          height: 3em;
          border-radius: 2px;
        }

        .food-categories-item-check {
          display: none;
        }

        &.active {
          box-shadow: none;

          .food-categories-item-check {
            display: none;
          }
        }
      }
    }
  }
  .no_item {
    padding: 5em;
    h2 {
      width: max-content;
    }
  }
}
</style>
