<template>
  <div>
    <div
      class="color-dashboard-background"
      v-if="items.length"
      :class="['food-menu', foodMenuHendler ? 'active' : 'notActive']"
    >
      <!-- <div class="bg">bg</div> -->
      <div
        :class="{
          'food-menu-item': true,
          ' color-dashboard-background': item.image != '',
        }"
        :style="{ background: item.image == '' ? item.item_color : '' }"
        v-for="item in items"
        :key="item._id"
        :value="dt(item)"
        @click.prevent="addToOrder(item)"
      >
        <img
          v-if="item.image != ''"
          class="food-menu-item-img"
          :src="item.image"
          :alt="dt(item)"
          @error="imageLoadError()"
        />
        <div
          class="food-menu-item-text color-text"
          :class="item.image === '' ? 'item-image-only' : ''"
        >
          {{ dt(item) }}
        </div>
        <div class="food-menu-item-price">
          {{ currency }} {{ item.value || 0 }}
        </div>
      </div>
      <Popup />
    </div>
    <div class="color-dashboard-background" v-if="!items.length">
      No menu item found
    </div>
  </div>
</template>

<script>
/* global $, showModal  */

import { mapGetters, mapState } from 'vuex'
import Popup from './items/Popup'

export default {
  name: 'Items',
  props: {
    msg: String,
  },
  components: {
    Popup,
  },
  computed: {
    ...mapState('location', ['currency']),
    ...mapGetters('category', ['items']),
    ...mapGetters('modifier', ['hasModifiers']),
    ...mapGetters(['foodMenuHendler', 'bascketItems']),
  },
  methods: {
    choosePrice(item) {
      if (item.countries.length !== 0) {
        return item.countries[0].value
      } else if (item.cities.length !== 0) {
        return item.cities[0].value
      } else if (item.stores.length !== 0) {
        return item.stores[0].value
      }
    },
    addToOrder(item) {
      this.$store.commit('order/SET_CART_TYPE', 'new')
      this.$store.commit('order/START_ORDER')
      $('#POSItemOptions .modifier-option-radio').prop('checked', false)
      $('.food-menu-item').removeClass('active')
      $(this).addClass('active')
      let cat = this.$store.getters['category/categories'].filter(
        data => data._id === item.category
      )
      let subcat = this.$store.getters['category/subcategories'].filter(
        data => data._id === item.sub_category
      )
      if (typeof cat !== 'undefined') {
        // this.$store.commit('category/SET_CATEGORY', cat[0])
      }
      if (typeof subcat !== 'undefined') {
        // this.$store.commit('category/SET_SUBCATEGORY', subcat[0])
      }
      this.$store.commit('category/SET_ITEM', item)
      this.$store.commit('checkoutForm/showCalc', true)
      this.$store.commit('orderForm/updateQuantity', 1)
      if (this.$store.getters['modifier/hasModifiers'](item)) {
        this.$store.dispatch('modifier/assignModifiersToItem', item)
        this.$store.commit('orderForm/clearSelection')
        showModal('#POSItemOptions')
      } else {
        this.$store.dispatch('order/addToOrder', item)
      }
      this.$store.dispatch('addItemFood', item)

      if (!this.bascketItems.find(x => x.name === item.name)) {
        this.bascketItems.push({ name: item.name, count: 1, class: 'active' })
      } else {
        this.bascketItems.find(x => x.name === item.name).count++
      }
    },
    IsImageOk(img) {
      // During the onload event, IE correctly identifies any images that
      // weren't downloaded as not complete. Others should too. Gecko-based
      // browsers act like NS4 in that they report this incorrectly.
      if (!img.complete) {
        return false
      }

      // However, they do have two very useful properties: naturalWidth and
      // naturalHeight. These give the true size of the image. If it failed
      // to load, either of these should be zero.
      if (typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0) {
        return false
      }

      // No other way of checking: assume it's ok.
      return true
    },

    imageLoadError() {
      // let myDoc = document.getElementsByClassName('.contain-body-class')
      /* myDoc = myDoc.remove('.sticky-footer')*/
      for (let i = 0; i < document.images.length; i++) {
        if (!this.IsImageOk(document.images[i])) {
          let hue = 'bg'
          /*'rgb(' +
                                          (Math.floor((256 - 199) * Math.random()) + 200) +
                                          ',' +
                                          (Math.floor((256 - 199) * Math.random()) + 200) +
                                          ',' +
                                          (Math.floor((256 - 199) * Math.random()) + 200) +
                          ')'*/
          $(document.images[i])
            .closest('div.pos-item-bg')
            .addClass(hue)
          $(document.images[i])
            .siblings('p')
            .css('font-size', '15px')
          $(document.images[i])
            .closest('div.pos-size-bg')
            .addClass(hue)
          // .css('background-color', hue)
          $(document.images[i])
            .siblings('span')
            .css('font-weight', 'bold')
          document.images[i].remove()
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../../../assets/scss/pixels_rem.scss';
@import '../../../../assets/scss/variables.scss';
@import '../../../../assets/scss/mixins.scss';

.pos-item-bg {
  img {
    max-width: 146px;
  }
}

@include responsive(mobile) {
  .food-menu {
    height: 100%;
    padding: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    background-color: transparent;
    .bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: darkblue;
    }
    &.active {
      top: 0;
      transition: 0.7s ease-out;
    }

    &.notActive {
      top: -100%;
      transition: 0.7s ease-out;
    }

    .food-menu-wrapper {
      padding: 0;
      height: auto;
    }

    .food-menu-item {
      width: 100%;
      height: 80px;
      padding: 0 10px;
      margin: 0;
      display: grid;
      align-items: center;
      grid-template-columns: auto 1fr max-content;
      grid-gap: 20px;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid $gray-middle;
      padding-right: 20px;
      background-color: #fafafa;
      transition: 0.1s ease-out;

      &:not(.color-dashboard-background) {
        // padding-left: 85px;
        padding-right: 0;
        // color: #fff;
        height: 40px;

        .food-menu-item-price {
          justify-self: end;
          color: #444;
        }
      }

      &.active {
        background-color: rgba(36, 189, 19, 0.1);
      }

      &:active {
        background-color: rgba(36, 189, 19, 0.2);
      }

      img {
        width: 65px;
        height: 65px;
        border-radius: 2px;
      }

      .food-menu-item-text {
        text-align: left;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .food-menu-item-price {
        display: block;
        color: $green-middle;
        font-weight: 600;
        white-space: nowrap;
      }
    }
  }
}
</style>
