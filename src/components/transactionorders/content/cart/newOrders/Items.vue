<template>
  <div class="transaction-item">
    <h3 class="trans_head">ITEMS</h3>
    <div class="trans-item-list">
      <div class="trans-menu-item">
        <div class="trans-menu-image">
          <img
            src="http://13.127.145.151/pos-new/images/pizza-medium.png"
            alt="item"
          />
        </div>
        <div class="trans-menu-list">
          <div class="orders-name">
            <p>Papperoni Pizza Small</p>
            <p class="price-qty">@ 21.90 x 2</p>
            <a href="" class="trans-item-btn">Bolognese Sauce</a
            ><a href="" class="trans-item-btn">Chunky Tomato</a>
          </div>
        </div>
      </div>
      <div class="trans-menu-replace">
        <div class="aed-amt">
          <span>AED 42.90</span>
        </div>
        <div class="replace-btn">
          <a href="#">Replace</a>
        </div>
      </div>
    </div>
    <div class="trans-item-list">
      <div class="trans-menu-item">
        <div class="trans-menu-image">
          <img
            src="http://13.127.145.151/pos-new/images/pizza-medium.png"
            alt="item"
          />
        </div>
        <div class="trans-menu-list">
          <div class="orders-name">
            <p>Papperoni Pizza Small</p>
            <p class="price-qty">@ 21.90 x 2</p>
            <a href="" class="trans-item-btn">Bolognese Sauce</a
            ><a href="" class="trans-item-btn">Chunky Tomato</a>
          </div>
        </div>
      </div>
      <div class="trans-menu-replace">
        <div class="aed-amt">
          <span>AED 42.90</span>
        </div>
        <div class="replace-btn">
          <a href="#">Replace</a>
        </div>
      </div>
    </div>
    <div class="trans-item-list">
      <div class="trans-menu-item">
        <div class="trans-menu-image">
          <img
            src="http://13.127.145.151/pos-new/images/pizza-medium.png"
            alt="item"
          />
        </div>
        <div class="trans-menu-list">
          <div class="orders-name">
            <p>Papperoni Pizza Small</p>
            <p class="price-qty">@ 21.90 x 2</p>
            <a href="" class="trans-item-btn">Bolognese Sauce</a
            ><a href="" class="trans-item-btn">Chunky Tomato</a>
          </div>
        </div>
      </div>
      <div class="trans-menu-replace">
        <div class="aed-amt">
          <span>AED 42.90</span>
        </div>
        <div class="replace-btn">
          <a href="#">Replace</a>
        </div>
      </div>
    </div>
    <div class="trans-item-list">
      <div class="trans-menu-item">
        <div class="trans-menu-image">
          <img
            src="http://13.127.145.151/pos-new/images/pizza-medium.png"
            alt="item"
          />
        </div>
        <div class="trans-menu-list">
          <div class="orders-name">
            <p>Papperoni Pizza Small</p>
            <p class="price-qty">@ 21.90 x 2</p>
            <a href="" class="trans-item-btn">Bolognese Sauce</a
            ><a href="" class="trans-item-btn">Chunky Tomato</a>
          </div>
        </div>
      </div>
      <div class="trans-menu-replace">
        <div class="aed-amt">
          <span>AED 42.90</span>
        </div>
        <div class="replace-btn">
          <a href="#">Replace</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import Modifiers from './items/Modifiers.vue'
//import * as CONST from '@/constants'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'Items',
  props: {},
  computed: {
    ...mapState({
      currentItem: state => state.order.item._id,
    }),
    ...mapState('order', ['orderType']),
    ...mapGetters('category', ['subcategoryImage']),
    ...mapGetters('modifier', ['hasModifiers']),
    ...mapGetters('order', [
      'items',
      'itemGrossPriceDiscounted',
      'itemGrossPrice',
      'orderModifiers',
    ]),
    ...mapGetters('location', ['formatPrice']),
  },
  methods: {
    ...mapActions('category', ['getItems']),
    ...mapActions('order', ['removeFromOrder', 'setActiveItem']),
  },
  components: {
    //    Modifiers,
  },
  watch: {
    //    orderType(newVal, previousVal) {
    //      if (newVal.OTApi !== previousVal.OTApi)
    //        if (this.$store.state.discount.appliedOrderDiscount) {
    //          this.$store.dispatch('discount/clearOrderDiscount')
    //        } else {
    //          this.$store.dispatch('discount/clearItemDiscount')
    //        }
    //    },
  },
}
</script>
<style lang="scss">
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
</style>
