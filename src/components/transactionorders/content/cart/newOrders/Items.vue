<template>
  <div class="transaction-item">
    <h3 class="trans_head">{{ _t('ITEMS') }}</h3>
    <div class="trans-item-list" v-for="(item, index) in items" :key="index">
      <div class="trans-menu-item">
          <div class="trans-menu-image">
          <img
            :src = getItemImage(item.name)
            :alt="_t('Image')"
          />
        </div>
        <div class="trans-menu-list">
          <div class="orders-name">
            <p>{{ item.name }}</p>
            <p class="price-qty">@ {{ item.price }} x {{ item.qty }} &nbsp; ({{ getItemDiscountValue(order.item_discounts).name }})</p>
              <a href="javascript:void" v-for="(modifier, indexNo) in order.item_modifiers" :key="indexNo" class="trans-item-btn">
                  <span v-if="modifier.for_item == index">{{ modifier.name }}</span>
              </a>
          </div>
        </div>
      </div>
      <div class="trans-menu-replace">
        <div class="aed-amt">
          <span>{{formatPrice((item.price * item.qty) - getItemDiscountValue(order.item_discounts).value || 0) }}</span>
        </div>
        <div class="replace-btn">
          <a href="javascript:void" @click="modifyOrder">{{ _t('Replace') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      getItemImage(itemName) {
          let itemData = this.$store.state.category.items.filter(
              data => data.name.toLowerCase() === itemName.toLowerCase()
          )
          return itemData[0].image
      },
      getItemDiscountValue(discounts) {
          let value = name = ''
          discounts.map(function (discount) {
              let type = (discount.type) === 'percentage' ? '%' : ''
              name += discount.name + ' ('+ discount.rate +  type + ')'
              value += discount.price
          })
          return ({name, value})
      },
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
