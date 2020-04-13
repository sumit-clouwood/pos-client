<template>
  <div>
    <div
      class="modal-body color-dashboard-background"
      :class="['food-menu', foodMenuHendler ? 'active' : 'notActive']"
      v-if="upSellingItems.length"
    >
      <div
        :class="{
          'food-menu-item': true,
          ' color-dashboard-background': item.image != '',
        }"
        :style="{ background: item.image == '' ? item.item_color : '' }"
        v-for="item in upSellingItems"
        :key="item._id"
        :value="dt(item)"
        @click.prevent="addToOrder(item)"
        ref="entityItem"
        :id="'id_' + item._id"
      >
        <!-- <div
          v-if="isEnabled"
          class="item-details-icon"
          @click.stop="showDetails(item)"
        >
          <img style="padding: 3px;" src="img/maximize.svg" />
        </div> -->
        <img
          v-if="item.image != ''"
          class="food-menu-item-img"
          :src="item.image"
          :alt="dt(item)"
          @error="imageLoadError()"
        />
        <div class="food-menu-price-btn-wrap">
          <div style="line-height: 2rem">
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
          <!-- data-target="#POSOrderItemOptions" -->
          <!-- <div
            class="button-plus"
            data-toggle="modal"
            @click="showModalBox('#POSOrderItemOptions')"
          >
            <div class="button-plus-icon">
              <svg
                class="color-text"
                viewBox="0 0 15 15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.40002 6.3999V1.3999C8.40002 1.13469 8.29467 0.880332 8.10713 0.692796C7.9196 0.505259 7.66524 0.399902 7.40002 0.399902C7.13481 0.399902 6.88045 0.505259 6.69292 0.692796C6.50538 0.880332 6.40002 1.13469 6.40002 1.3999V6.3999H1.40002C1.13481 6.3999 0.880454 6.50526 0.692918 6.6928C0.505381 6.88033 0.400024 7.13469 0.400024 7.3999C0.400024 7.66512 0.505381 7.91947 0.692918 8.10701C0.880454 8.29455 1.13481 8.3999 1.40002 8.3999H6.40002V13.3999C6.40002 13.6651 6.50538 13.9195 6.69292 14.107C6.88045 14.2945 7.13481 14.3999 7.40002 14.3999C7.66524 14.3999 7.9196 14.2945 8.10713 14.107C8.29467 13.9195 8.40002 13.6651 8.40002 13.3999V8.3999H13.4C13.6652 8.3999 13.9196 8.29455 14.1071 8.10701C14.2947 7.91947 14.4 7.66512 14.4 7.3999C14.4 7.13469 14.2947 6.88033 14.1071 6.6928C13.9196 6.50526 13.6652 6.3999 13.4 6.3999H8.40002Z"
                />
              </svg>
            </div>
          </div> -->
        </div>
      </div>
      <item-details-popup
        v-show="currentItem"
        v-model="currentItem"
        @resetCurrentItem="resetCurrentItem"
      />
      <div
        class="color-dashboard-background"
        v-if="!upSellingItems.length"
        :class="['food-menu', foodMenuHendler ? 'active' : 'notActive']"
      ></div>
    </div>
    <div class="text-success msg-padding" v-if="msg">{{ msg }}</div>
  </div>
</template>
<script>
/* global $, showModal, hideModal  */
import { mapGetters, mapState } from 'vuex'
import * as CONST from '@/constants'
import ItemDetailsPopup from '@/components/pos/content/catalog/items/popup/ItemDetailsPopup.vue'
import Cart from '@/mixins/Cart'

export default {
  name: 'Items',
  mixins: [Cart],
  components: {
    ItemDetailsPopup,
  },
  data() {
    return {
      upSellingItems: [],
      msg: false,
    }
  },
  computed: {
    ...mapState('category', ['barcode', 'upSelling', 'isUpSellingDelete']),
    ...mapState('order', ['item']),
    ...mapState('comboItems', ['comboItemsList']),
    ...mapGetters(['foodMenuHendler']),
  },
  watch: {
    item() {
      this.$nextTick(() => {
        if (!this.isUpSellingDelete && !this.comboItemsList) {
          this.getUpSellingItems()
        }
      })
      setTimeout(() => {
        if (this.msg) {
          this.msg = false
        }
      }, 3000)
    },
  },
  methods: {
    getUpSellingItems() {
      // eslint-disable-next-line no-console
      console.log(this.item, 'up selling ')
      if (
        this.item.item_type !== CONST.COMBO_ITEM_TYPE &&
        !this.item.is_upselling
      ) {
        $('[id^=id_]').show()
        this.upSellingItems = []
        if (this.upSelling.length) {
          this.upSelling.forEach(itemList => {
            if (itemList.categories.includes(this.item.category)) {
              // get all item those have upsale items
              // this.upSellingItems.push(item)
              let itemModification = { ...itemList.item }
              itemModification.value = itemModification.upselling_value
              this.upSellingItems.push(itemModification)
            }
          })
          showModal('#up-selling-popup')
        }

        // eslint-disable-next-line no-console
        console.log(
          this.items,
          'this.items',
          'this.upSelling',
          this.upSelling,
          'this.upSellingItems',
          this.upSellingItems
        )
      }
    },
    addToOrder(item) {
      this.$store.dispatch('comboItems/reset')
      // $('#id_' + item._id).hide()
      this.upSellingItems.pop(item)
      if (this.upSellingItems.length === 0) {
        hideModal('#up-selling-popup')
      }
      this.msg = `${item.name} has been added to cart`
      /*this.$store.commit('order/setAlert', {
        type: 'Success',
        title: 'Item added',
        ,
      })*/
      // $('#alert-popup').modal('show')
      return this.itemsAddToCart(item)
    },
  },
  // showModalBox(modalName) {
  //   $(modalName).css({ 'z-index': 1052 })
  //   $(modalName).toggle()
  // },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.item-details-icon {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 999;
  height: 3.6rem;
  width: 100%;
  clip-path: polygon(0px 0px, 0px 100%, 45% 0px);
  background: rgba(220, 220, 220, 0.9);
  @include responsive(mobile) {
    display: none !important;
  }
}

.modal-body {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($px160, 1fr));
  flex-wrap: wrap;
  align-items: stretch;
  align-content: start;
  overflow-y: auto;
  .food-menu-item {
    padding: 8px;
    cursor: pointer;
    border: $px1 solid #ddd;
    border-radius: $px5;
    justify-self: center;
    display: grid;
    grid-template-columns: auto;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin-right: $px20;
    margin-bottom: $px20;
    -webkit-transition: 0.2s linear;
    transition: 0.2s linear;
    &:hover {
      transition: 0.2s ease-out;
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
    }
    font-size: $px16;
    position: relative;
    /*transition: width 0.25s ease-out, height 0.25s ease-out 0.25s;*/
    .food-menu-item-img {
      /*<!--margin: $px5 auto;-->*/
      border-radius: $px3;
      width: $px140;
      max-height: $px130;
      margin: auto;
    }
    .food-menu-item-text {
      font-size: 1rem;
      text-align: left;
      word-break: normal;
    }
    .item-image-only {
      width: 100px;
      padding: 10px;
      height: 142px;
    }
    .food-menu-item-price {
      text-align: left;
      color: crimson;
      font-size: 0.9rem;
      font-weight: 600;
    }
  }
}
.foodbox_container {
  position: relative;
  cursor: pointer;
  border: solid;
  border-color: #5056ca5e;
  width: 100%;
  border-radius: 5px;
  min-height: 5.625rem !important;
  max-height: 5.625rem !important;
  // max-width: 11.063rem !important;
  @include responsive(mobile) {
    max-height: 100% !important;
    max-width: 100% !important;
  }
}
i.fa.fa-check.item-selected-check {
  position: absolute;
  top: 0;
  right: 0;
  background: #5056ca;
  color: white;
  padding: 0.298rem;
  font-weight: 400;
  border-radius: 0.25rem;
  font-size: 1.125rem;
}
.addtocart-icon {
  text-align: center;
  cursor: pointer;
}
.addtocart-icon {
  font-size: 2.125rem;
  color: #5056ca;
}

.foodbox_price_cntr {
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 0px 0.313rem;
  align-items: center;
}
.foodbox_container:hover {
  box-shadow: #5056ca42 0px 0.063rem 0.75rem;
}
.button-plus {
  padding-right: 0.5rem;
}
.food-menu-item-text.color-text {
  max-height: 3.188rem;
  display: -webkit-box;
  overflow: scroll;
  text-overflow: ellipsis;
  line-height: 1.43rem !important;
  word-break: normal;
  padding-right: 0.938rem;
  margin-top: 0.625rem;
}
.food-menu .food-menu-item {
  transition: color 0.25s;
}
.food-menu .food-menu-item::before,
.food-menu .food-menu-item::after {
  border: 2px solid transparent;
  width: 0;
  height: 0;
}
.food-menu .food-menu-item::before {
  top: 0;
  left: 0;
}
.food-menu .food-menu-item::after {
  bottom: 0;
  right: 0;
}
.food-menu .food-menu-item:hover {
  color: #5056ca;
  font-weight: bold;
  box-shadow: 0 0 4px 1px #5056ca;
}
.msg-padding {
  padding-left: 1.875rem;
  font-weight: bold;
  font-size: 16px;
}
.food-menu-price-btn-wrap {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  grid-gap: 5px;
}
</style>
