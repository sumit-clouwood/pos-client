<template>
  <div class="main-orders-list" v-if="items">
    <div
      class="main-orders-list-item color-dashboard-background"
      v-for="(item, index) in items"
      :key="index + '-' + item._id"
    >
      <div class="main-orders-list-item-title color-text">
        <div class="orders-name">{{ dt(item) }}</div>
        <div class="orders-amount">
          {{ formatPrice(itemGrossPriceDiscounted(item)) }}
        </div>
        <div
          v-if="typeof item.cover_name === 'undefined'"
          class="orders-close"
          @click.prevent="removeCurrentOrder({ item: item, index: index })"
        >
          <span class="dlt-icon">
            <img src="img/pos/delete-icon.svg" />
          </span>
        </div>
      </div>
      <div
        class="main-orders-list-item-subtitle color-text-invert item-exclude"
      >
        <div>
          @ {{ formatPrice(itemGrossPrice(item)) }} x
          {{ item.quantity }}
          {{ discountInfo(item) }}
        </div>
        <!--add condition here split true-->
        <div
          class="align-right text-right"
          v-if="orderType.OTApi === 'dine_in' && split"
        >
          <!--<label class="pos-container">
            <input
              type="checkbox"
              @click="splitItems({ item: item, e: $event, key: index })"
            />
            <span class="checkmark"></span>
            &lt;!&ndash;<select class="">
              <option>Select Guest</option>
              <option v-for="guest in guests" :key="guest"
                >Guest {{ guest }}</option
              >
            </select>&ndash;&gt;
          </label>-->
        </div>
      </div>
      <div
        class="main-orders-list-item-subtitle color-text-invert"
        v-if="orderType.OTApi === 'dine_in'"
      >
        <p class="selectedCoverName">
          {{ item.cover_name }}
        </p>
      </div>
      <div class="main-orders-list-item-buttons">
        <Modifiers v-bind:modifiers="item.modifiers" v-if="item.modifiable" />
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
          <!--src="img/pos/plus-icon.png"-->
          <!--alt="plus"-->
          <!--@click="setActiveItem({ orderItem: item, index: index })"-->
          <!--/>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modifiers from '@/components/pos/content/cart/newOrders/items/Modifiers.vue'
import * as CONST from '@/constants'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'Items',
  data() {
    return {
      splitedItems: [],
      newItemList: [],
    }
  },
  computed: {
    ...mapState('dinein', ['covers', 'split', 'guests']),
    ...mapState({
      currentItem: state => state.order.item._id,
    }),
    ...mapState('order', ['orderType', 'selectedOrder']),
    ...mapGetters('category', ['subcategoryImage']),
    ...mapGetters('modifier', ['hasModifiers']),
    ...mapGetters('order', [
      'items',
      'itemGrossPriceDiscounted',
      'itemGrossPrice',
      'orderModifiers',
    ]),
    ...mapGetters('location', ['formatPrice', '_t']),
  },
  methods: {
    ...mapActions('category', ['getItems']),
    ...mapActions('order', ['removeFromOrder', 'setActiveItem']),
    splitItems(data) {
      if (data.e.target.checked) {
        this.splitedItems.push(data.item)
      } else {
        this.splitedItems.splice(data.key, 1)
      }
      this.newItemList = this.items
      if (this.splitedItems.length > 0) {
        this.newItemList = this.items.filter(
          item => !this.splitedItems.includes(item)
        )
      }
      // eslint-disable-next-line no-console
      console.log(this.splitedItems)
      // eslint-disable-next-line no-console
      console.log(this.newItemList)
    },
    discountInfo(item) {
      if (item.discount) {
        return (
          ' - ' +
          (item.discount.type === CONST.VALUE
            ? item.discount.value
            : item.discount.rate + ' %') +
          ' ( ' +
          item.discount.name +
          ' - ' +
          (item.discount.type == CONST.VALUE
            ? this.formatPrice(item.discount.value)
            : item.discount.rate + ' %') +
          ' )'
        )
      }
      return ''
    },
    removeCurrentOrder(param) {
      this.removeFromOrder(param)
      if (!this.items.length) {
        this.$store.dispatch('mainOrdersHendlerChange')
      }
    },
  },
  components: {
    Modifiers,
  },
  watch: {
    orderType(newVal, previousVal) {
      if (newVal.OTApi !== previousVal.OTApi)
        if (this.$store.state.discount.appliedOrderDiscount) {
          this.$store.dispatch('discount/clearOrderDiscount')
        } else {
          this.$store.dispatch('discount/clearItemDiscount')
        }
    },
  },
}
</script>
<style lang="scss">
@import '../../../assets/scss/pixels_rem.scss';
@import '../../../assets/scss/variables.scss';
@import '../../../assets/scss/mixins.scss';

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
