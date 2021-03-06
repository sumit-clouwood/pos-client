<template>
  <div class="transaction-item">
    <h3 class="trans_head">{{ _t('ITEMS') }}</h3>
    <div class="trans-item-list-wrapper item-list-wrapper item-height-wrapper">
      <div class="trans-item-list" v-for="(item, index) in items" :key="index">
        <div class="trans-menu-item">
          <div
            class="trans-menu-image"
            :style="{
              background:
                getItemImage(item.name, 'image') === ''
                  ? getItemImage(item.name, 'item_color')
                  : '',
            }"
          >
            <img
              v-if="getItemImage(item.name, 'image') !== ''"
              :src="getItemImage(item.name, 'image')"
              :alt="_t('Image')"
            />
          </div>
          <div class="trans-menu-list">
            <div class="orders-name">
              <p>
                {{ item.name }}
              </p>
              <p class="price-qty">
                @
                {{
                  formatPrice(
                    parseFloat(item.price) + parseFloat(item.tax || 0)
                  )
                }}
                x {{ item.qty }} &nbsp; - &nbsp;
                {{ getItemDiscountValue(order.item_discounts, item).name }}
              </p>
              <span
                v-for="(modifier, indexNo) in order.item_modifiers"
                :key="indexNo"
                class="trans-item-btn"
              >
                <span v-if="modifier.for_item == index">{{
                  modifier.name
                }}</span>
                <span v-if="modifier.price !== 0">
                  &nbsp; ({{
                    format_number(
                      parseFloat(modifier.price) + parseFloat(modifier.tax)
                    )
                  }}
                  x {{ modifier.qty }})&#x200E;</span
                >
                <span v-else-if="modifier.qty > 1"
                  >(x {{ modifier.qty }})&#x200E;</span
                >
              </span>
              <div v-if="item.note">
                <span class="item-note">{{ _t('Note') }}: </span>
                <i> {{ item.note }}</i>
              </div>
            </div>
          </div>
        </div>
        <div class="trans-menu-replace">
          <div class="aed-amt">
            <span>
              <!-- {{
                formatPrice(
                  item.price * item.qty -
                    getItemDiscountValue(order.item_discounts, item).value || 0
                )
              }} -->
              {{ formatPrice(item_total(item.no)) }}
            </span>
          </div>
          <!--<div class="replace-btn">
            <a href="javascript:void(0)" @click="modifyThisOrder">{{
              _t('Replace')
            }}</a>
          </div>-->
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
    catItems: Array,
  },
  computed: {
    ...mapState({
      currentItem: state => state.order.item._id,
    }),
    ...mapGetters('location', ['formatPrice', '_t']),
  },
  methods: {
    item_total(item_no) {
      var total = 0
      for (var item of this.order.items) {
        if (item.no == item_no) {
          total += (parseFloat(item.price) + parseFloat(item.tax)) * item.qty
        }
      }
      for (var modifier of this.order.item_modifiers) {
        if (modifier.for_item == item_no) {
          total +=
            (parseFloat(modifier.price) + parseFloat(modifier.tax)) *
            modifier.qty
        }
      }
      for (var item_discount of this.order.item_discounts) {
        if (item_discount.for_item == item_no) {
          total -= parseFloat(item_discount.price)
          total -= parseFloat(item_discount.tax)
        }
      }
      return total < 0 ? '0.00' : total
    },
    format_number(number) {
      return parseFloat(number).toFixed(2)
    },
    getItemImage(itemName, column) {
      let itemData = this.catItems.find(
        data => data.name.toLowerCase() === itemName.toLowerCase()
      )
      return itemData[column]
    },
    getItemDiscountValue(discounts, item) {
      let value = ''
      let name = ''
      discounts.map(function(discount) {
        if (item.no == discount.for_item) {
          let type = discount.type === 'percentage' ? '%' : ''
          name += '(' + discount.name + ' (' + discount.rate + type + '))'
          value += discount.price
        }
      })
      return { name, value }
    },
    ...mapActions('category', ['getItems']),
    ...mapActions('order', ['removeFromOrder', 'setActiveItem']),
    modifyThisOrder() {
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
.trans-item-btn:empty {
  display: none !important;
}
.item-note {
  color: #3d3f43;
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
@include responsive(mobile) {
  .item-list-wrapper {
    overflow: scroll;
  }
  .item-height-wrapper {
    height: 16vh !important;
  }
}
</style>
