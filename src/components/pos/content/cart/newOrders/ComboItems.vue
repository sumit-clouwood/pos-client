<template>
  <div class="main-orders-list" ref="cartItemsContainer">
    <div v-if="items && items.length">
      <div
        class="main-orders-list-item color-dashboard-background"
        v-for="(item, index) in items"
        :key="index + '-' + item._id"
        ref="entityCartItem"
      >
        <div v-if="multistore" class="storename">
          {{ storeName(item.store_id) }}
        </div>

        <div class="main-orders-list-item-title color-text">
          <div class="orders-name">
            <button class="toggle_btn" @click="showCombo()">
              <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </button>
            {{ dt(item) }}
          </div>
          <div class="orders-amount">
            {{ formatPrice(itemGrossPriceDiscounted(item)) }}
          </div>
          <div
            class="orders-close"
            @click.prevent="removeCurrentOrder({ item: item, index: index })"
          >
            <span class="dlt-icon">
              <img
                src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/delete-icon.svg"
              />
            </span>
          </div>
        </div>
        <div
          class="main-orders-list-item-subtitle color-text-invert item-exclude"
        >
          <div v-html="formatItemDiscount(item)"></div>
          <i v-if="item.note">{{ item.note }}</i>
        </div>
        <div id="sub_dsc" class="sub_container">
          <div class="subdescription_container">
            <div
              class="product_sub_description main-orders-list-item-subtitle color-text-invert item-exclude"
            >
              Pizza Combo Offer x 2
            </div>
            <div class="sub_description_price">
              + NZD 60.00
            </div>
          </div>
          <div class="sub_des_catagary">
            <div class="sub_more_description">
              pizza with extra cheese / cold drinks / franchise / Momos and more
            </div>
            <div class="sub_more_description_price">
              + NZD 15.00
            </div>
          </div>
        </div>
        <div class="main-orders-list-item-buttons">
          <Modifiers
            v-bind:modifiers="item.modifiers"
            v-bind:item="item"
            v-if="item.modifiable"
          />
          <div
            class="button-plus"
            data-toggle="modal"
            data-target="#POSOrderItemOptions"
          >
            <div
              class="button-plus-icon"
              @click="setActiveItem({ orderItem: item, index: index })"
            >
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
            <!--<img-->
            <!--src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/plus-icon.png"-->
            <!--alt="plus"-->
            <!--@click="setActiveItem({ orderItem: item, index: index })"-->
            <!--/>-->
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="orderId && ['carhop'].includes(orderType.OTApi)">
        <preloader></preloader>
      </div>
    </div>
  </div>
</template>

<script>
import Modifiers from './items/Modifiers.vue'
import Preloader from '@/components/util/Preloader'

import { mapState, mapActions, mapGetters } from 'vuex'
import Discount from '@/mixins/Discount'
import { bus } from '@/eventBus'
import Scroll from '@/mixins/Scroll'
/* global $ */
export default {
  name: 'Items',
  data() {
    return {
      newItemList: [],
      container: 'cartItemsContainer',
      entity: 'entityCartItem',
      margin: 4.375,
      keepEntitiesInScroll: 0,
    }
  },
  mixins: [Discount, Scroll],
  computed: {
    ...mapState({
      currentItem: state => state.order.item._id,
    }),
    ...mapState('order', ['orderType', 'selectedOrder', 'orderId']),
    ...mapGetters('category', ['subcategoryImage']),
    ...mapGetters('modifier', ['hasModifiers']),
    ...mapGetters('order', [
      'items',
      'itemGrossPriceDiscounted',
      'itemGrossPrice',
      'orderModifiers',
      'orderType',
      'itemModifiersPrice',
    ]),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('context', ['storeName']),
    ...mapGetters('auth', ['multistore']),
  },
  mounted() {
    bus.$on('scroll-cart', option => {
      this.scroll(option)
    })

    bus.$emit('showScrollCartUp', this.showScrollUp)
    bus.$emit('showScrollCartDown', this.showScrollDown)

    bus
      .$on('showScrollUp-cartItemsContainer', option => {
        bus.$emit('showScrollCartUp', option)
      })
      .$on('showScrollDown-cartItemsContainer', option => {
        bus.$emit('showScrollCartDown', option)
      })
  },

  watch: {
    items(newVal, oldVal) {
      if (newVal != oldVal) {
        this.$nextTick(() => {
          this.calculateScrolls()
            .then(() => {
              bus.$emit('showScrollCartUp', this.showScrollUp)
              bus.$emit('showScrollCartDown', this.showScrollDown)
            })
            .catch(() => {})
        })
      }
    },
    orderType(newVal, previousVal) {
      if (newVal.OTApi !== previousVal.OTApi)
        if (this.$store.state.discount.appliedOrderDiscount) {
          this.$store.dispatch('discount/clearOrderDiscount')
        } else {
          this.$store.dispatch('discount/clearItemDiscount')
        }
    },
  },
  methods: {
    ...mapActions('category', ['getItems']),
    ...mapActions('order', ['removeFromOrder', 'setActiveItem']),
    showCombo() {
      $('#sub_dsc').slideToggle(200)
      //      $('i', this).toggleClass('fa fa fa-chevron-down fa-chevron-right ')
      $('.orders-name i').toggleClass('fa fa fa-chevron-down fa-chevron-right ')
    },
    removeCurrentOrder(param) {
      // if (this.selectedOrder || this.orderId) {
      //   if (
      //     (this.orderType == 'carhop' || this.orderType.OTApi === 'carhop') &&
      //     this.selectedOrder.item.order_status == 'in-progress' &&
      //     !this.allowed(this.PERMS.MODIFY_ORDER)
      //   ) {
      //     return
      //   }
      // }
      this.removeFromOrder(param)
      if (!this.items.length) {
        this.$store.dispatch('mainOrdersHendlerChange')
      }
    },
  },
  components: {
    Modifiers,
    Preloader,
  },
}
</script>
<style lang="scss">
@import '../../../../../assets/scss/pixels_rem.scss';
@import '../../../../../assets/scss/variables.scss';
@import '../../../../../assets/scss/mixins.scss';
.main-orders-list-item {
  .storename {
    font-size: 9px;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
  }
}
button.toggle_btn {
  min-width: 22px;
  max-width: 22px;
  color: #565252;
  border: 0px;
}
.sub_container {
  margin-bottom: 0.625rem;
  .subdescription_container {
    display: grid;
    grid-template-columns: 1fr auto;
    .sub_description_price {
      font-size: 14px;
    }
    .product_sub_description {
      margin-bottom: 0px !important;
    }
  }
}
.sub_des_catagary {
  display: grid;
  grid-template-columns: 1fr auto;
  .sub_more_description {
    font-size: 14px;
    font-style: italic;
    color: gray;
    padding-left: 0.87rem;
    word-break: break-all;
    padding: 0px 0.87rem;
  }
  .sub_more_description_price {
    font-size: 14px;
    /*font-style: italic;*/
    color: gray;
  }
}
.button-plus-icon {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background-color: #3a3e9e;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: #fff;
    width: 13px;
  }
}

@include responsive(mobile) {
  .button-plus-icon {
    background-color: $green-middle;
  }
}
</style>
