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
          class="orders-close"
          @click.prevent="removeFromOrder({ item: item, index: index })"
        >
          <svg
            class="color-text-invert"
            width="16"
            height="16"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.5 4.5C0.5 4.08579 0.835786 3.75 1.25 3.75H14.75C15.1642 3.75 15.5 4.08579 15.5 4.5C15.5 4.91421 15.1642 5.25 14.75 5.25H1.25C0.835786 5.25 0.5 4.91421 0.5 4.5Z"
              fill="#CC3232"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.5 2.25C6.30109 2.25 6.11032 2.32902 5.96967 2.46967C5.82902 2.61032 5.75 2.80109 5.75 3V3.75H10.25V3C10.25 2.80109 10.171 2.61032 10.0303 2.46967C9.88968 2.32902 9.69891 2.25 9.5 2.25H6.5ZM11.75 3.75V3C11.75 2.40326 11.5129 1.83097 11.091 1.40901C10.669 0.987053 10.0967 0.75 9.5 0.75H6.5C5.90326 0.75 5.33097 0.987053 4.90901 1.40901C4.48705 1.83097 4.25 2.40326 4.25 3V3.75H2.75C2.33579 3.75 2 4.08579 2 4.5V15C2 15.5967 2.23705 16.169 2.65901 16.591C3.08097 17.0129 3.65326 17.25 4.25 17.25H11.75C12.3467 17.25 12.919 17.0129 13.341 16.591C13.7629 16.169 14 15.5967 14 15V4.5C14 4.08579 13.6642 3.75 13.25 3.75H11.75ZM3.5 5.25V15C3.5 15.1989 3.57902 15.3897 3.71967 15.5303C3.86032 15.671 4.05109 15.75 4.25 15.75H11.75C11.9489 15.75 12.1397 15.671 12.2803 15.5303C12.421 15.3897 12.5 15.1989 12.5 15V5.25H3.5Z"
              fill="#CC3232"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.5 7.5C6.91421 7.5 7.25 7.83579 7.25 8.25V12.75C7.25 13.1642 6.91421 13.5 6.5 13.5C6.08579 13.5 5.75 13.1642 5.75 12.75V8.25C5.75 7.83579 6.08579 7.5 6.5 7.5Z"
              fill="#CC3232"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.5 7.5C9.91421 7.5 10.25 7.83579 10.25 8.25V12.75C10.25 13.1642 9.91421 13.5 9.5 13.5C9.08579 13.5 8.75 13.1642 8.75 12.75V8.25C8.75 7.83579 9.08579 7.5 9.5 7.5Z"
              fill="#CC3232"
            />
          </svg>
        </div>
      </div>
      <div class="main-orders-list-item-subtitle color-text-invert">
        @ {{ formatPrice(itemGrossPrice(item)) }} x
        {{ item.quantity }}
        {{ discountInfo(item) }}
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
import Modifiers from './items/Modifiers.vue'
import * as CONST from '@/constants'
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
@import '../../../../../assets/scss/pixels_rem.scss';
@import '../../../../../assets/scss/variables.scss';
@import '../../../../../assets/scss/mixins.scss';

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
