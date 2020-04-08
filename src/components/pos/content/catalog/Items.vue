<template>
  <div class="food-items">
    <div
      class="food-top-arrow food-arrow"
      v-show="showScrollUp"
      @click="scroll"
    >
      <i class="fa fa-chevron-up" aria-hidden="true"></i>
    </div>
    <div
      class="food-bottom-arrow food-arrow"
      v-show="showScrollDown"
      @click="scroll('up')"
    >
      <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>

    <div
      class="color-dashboard-background"
      v-if="items.length"
      :class="['food-menu', foodMenuHendler ? 'active' : 'notActive']"
      ref="itemsContainer"
    >
      <!-- <div class="bg">bg</div> -->
      <!--      <btnBack :param="'item'" />-->
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
        ref="entityItem"
      >
        <div
          v-if="isEnabled"
          class="item-details-icon"
          @click.stop="showDetails(item)"
        >
          <img style="padding: 3px;" src="img/maximize.svg" />
        </div>
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
      <item-details-popup
        v-model="currentItem"
        @resetCurrentItem="resetCurrentItem"
      />

      <!-- <Popup /> -->
    </div>
    <div
      class="color-dashboard-background"
      v-if="!items.length"
      :class="['food-menu', foodMenuHendler ? 'active' : 'notActive']"
    >
      <!--<btnBack :param="'item'" />-->
      <div class="no_item">
        <h2>{{ _t('No menu item found') }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
/* global $, showModal  */
import { mapGetters, mapState } from 'vuex'
import * as CONST from '@/constants'
import ItemDetailsPopup from './items/popup/ItemDetailsPopup'
// import Popup from './items/Popup'
import Scroll from '@/mixins/Scroll'
import Cart from '@/mixins/Cart'
// import btnBack from '../../../mobileComponents/mobileElements/btnBack'

export default {
  name: 'Items',
  props: {
    msg: String,
  },
  mixins: [Scroll, Cart],
  components: {
    ItemDetailsPopup,
  },
  data() {
    return {
      container: 'itemsContainer',
      entity: 'entityItem',
      margin: 17.5,
      keepEntitiesInScroll: 0,
      currentItem: {},
    }
  },
  computed: {
    ...mapState('category', ['barcode']),
    ...mapState('location', ['currency']),
    ...mapState('order', ['splitBill', 'selectedOrder']),
    ...mapGetters('order', ['orderType']),
    ...mapGetters('location', ['_t']),
    ...mapGetters('category', ['items', 'itemByCode']),
    ...mapGetters('modifier', ['hasModifiers']),
    ...mapGetters(['foodMenuHendler']),
    isEnabled() {
      return this.$store.getters['modules/enabled'](CONST.MODULE_DINE_IN_MENU)
    },
  },
  watch: {
    items() {
      this.$nextTick(() => {
        this.calculateScrolls().catch(() => {})
      })
    },
    barcode(itemCode) {
      if (itemCode) {
        const item = this.itemByCode(itemCode)
        if (item) {
          this.addToOrder(item)
        }
        this.$store.commit('category/setBarcode', false)
      }
    },
  },
  created() {},
  updated() {},
  beforeUpdated() {},
  methods: {
    resetCurrentItem(payLoad) {
      this.currentItem = payLoad
    },
    showDetails(item) {
      this.currentItem = item
      showModal('#item-details-popup')
    },
    addToOrder(item) {
      if (item.item_type === CONST.COMBO_ITEM_TYPE) {
        // eslint-disable-next-line no-console
        console.log('combo_item', item)
        this.$store.commit('comboItems/ACTIVE_COMBO_ITEMS', {}, { root: true })
        this.$store.commit('comboItems/SET_COMBO_ITEMS', item)
        this.$store.commit(
          'comboItems/SET_SELECTED_ITEM_DATA',
          item.combo_items[0]
        )
        this.$store.dispatch('comboItems/findItemById')
        showModal('#combox-box-popup')
      } else {
        return this.itemsAddToCart(item)
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
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.pos-item-bg {
  img {
    max-width: 146px;
  }
}
.item-details-icon {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 999;
  height: 3.6rem;
  width: 100%;
  clip-path: polygon(0px 0px, 0px 100%, 45% 0px);
  background: rgba(220, 220, 220, 0.9);
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
      height: 4em !important;
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
      background: #fafafa;
      transition: 0.1s ease-out;
      .item-details-icon {
        display: none;
      }
      &:not(.color-dashboard-background) {
        // padding-left: 85px;
        padding-right: 0;
        // color: #fff;
        height: 4em;

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
        width: 3em;
        height: 3em;
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
  /*.no_item {
    padding: 5em;
    h2 {
      width: max-content;
    }
  }*/
}
.no_item {
  padding: 5em;
  h2 {
    width: max-content;
  }
}
.food-items {
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
<style lang="sass" scoped>
.food-items
  scroll-behavior: smooth

  .food-arrow
    margin-right: -26px

  .food-menu-item
    height: 174px
</style>
