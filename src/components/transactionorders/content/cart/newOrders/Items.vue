<template>
  <div class="transaction-item">
    <h3 class="trans_head">{{ _t('ITEMS') }}</h3>
    <div class="trans-item-list" v-for="(item, index) in items" :key="index">
      <div class="trans-menu-item">
        <div class="trans-menu-image">
          <img
            src="http://13.127.145.151/pos-new/images/pizza-medium.png"
            :alt="_t('Image')"
          />
        </div>
        <div class="trans-menu-list">
          <div class="orders-name">
            <p>{{ item.name }}</p>
            <p class="price-qty">@ {{ item.price }} x {{ item.qty }}</p>
            <a href="javascript:void" class="trans-item-btn">Bolognese Sauce</a>
            <a href="javascript:void" class="trans-item-btn">Chunky Tomato</a>
          </div>
        </div>
      </div>
      <div class="trans-menu-replace">
        <div class="aed-amt">
          <span>{{ order.currency }} {{ item.price * item.qty }}</span>
        </div>
        <div class="replace-btn">
          <a href="javascript:void" @click="modifyOrder">{{ _t('Replace') }}</a>
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
  props: {
    items: Array,
    order: Object,
  },
  computed: {
    ...mapState({
      currentItem: state => state.order.item._id,
    }),
    ...mapGetters('location', ['formatPrice', '_t']),
  },
  methods: {
    ...mapActions('category', ['getItems']),
    ...mapActions('order', ['removeFromOrder', 'setActiveItem']),
    modifyOrder() {
      this.$store.dispatch('order/modifyOrderTransaction').then(() => {
        this.$router.push({ path: this.$store.getters['context/store'] })
      })
    },
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
