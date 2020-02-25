<template>
  <div>
    <button
      v-if="device == 'mobile' && transactionDetailView"
      class="btn btn-success mobile-back-button"
      v-on:click="getReferPath()"
    >
      &lt; {{ _t('Back') }}
    </button>
    <div
      v-if="selectedOrder"
      :class="['main-orders', { active: mainOrdersHendler }]"
      class="main-orders color-dashboard-background"
    >
      <Header :order="selectedOrder.item" />
      <div class="main-orders-list-wrapper">
        <Items
          :order="selectedOrder.item"
          :items="selectedOrder.item.items"
          :catItems="catItems"
        />
      </div>
      <Footer :order="selectedOrder.item" />
      <orders-menu />
    </div>
    <div class="food-block" v-else>
      <div class="text-danger text-center font-weight-bold">
        {{ _t('No orders found.') }}
      </div>
    </div>
  </div>
</template>

<script>
import Header from './cart/newOrders/Header.vue'
import Footer from './cart/Footer'
import Items from './cart/newOrders/Items.vue'
import ordersMenu from '../../mobileComponents/mobileOrdersMenu.vue'

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Cart',
  props: {
    msg: String,
  },
  data() {
    return {
      catItems: this.$store.state.category.items,
    }
  },
  computed: {
    ...mapState('order', ['cartType', 'selectedOrder']),
    ...mapState('checkout', ['order']),
    ...mapGetters(['mainOrdersHendler']),
    ...mapGetters('location', ['_t']),
    ...mapGetters(['transactionDetailView', 'transactionListView', 'device']),
  },
  methods: {
    cartClose() {
      this.$store.dispatch('cartClose')
    },
    getReferPath() {
      this.$store.dispatch('transactionList')
    },
  },
  components: {
    Header,
    Items,
    Footer,
    // PayNow,
    ordersMenu,
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .mobile-back-button {
    margin-left: 1rem;
  }
  .main-orders {
    position: fixed;
    top: 0;
    right: -100vw;
    bottom: 0;
    width: 100vw;
    padding: 20px;
    height: 100%;
    background-color: #fff;
    padding: 0;
    grid-template-rows: max-content max-content 1fr;
    overflow: hidden;
    transition: 0.5s ease-out;
    border-bottom: 1px solid $gray-middle;
    grid-column-start: 1;
    grid-column-end: 2;
    z-index: 50;

    .mobile-footer {
      padding-top: 0;

      .btn-cart {
        display: none;
      }

      .main-orders-buttons {
        display: grid;
      }
    }

    &.active {
      right: 0px;
    }

    .main-orders-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      font-weight: 600;
      font-size: 18px;

      .fa {
        font-size: 22px;
        font-weight: 600;
      }
    }

    .main-orders-contacts {
      margin: 0;
      padding: 0 20px 20px 20px;

      .main-oreders-title {
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .main-oreders-date {
        text-align: right;
      }

      .main-oreders-buttons {
        display: none;
        margin: auto !important;
      }
    }

    .main-orders-list-wrapper {
      padding: 0;
      background-color: #fafafa;

      .main-orders-list {
        grid-gap: 0;

        .main-orders-list-item {
          border-radius: 0;
          border: none;
          border-bottom: 1px solid $gray-middle;
          padding: 10px 0;
          margin: 0 20px;
          background-color: #fafafa;

          &:last-child {
            border-bottom: none;
          }

          .main-orders-list-item-title {
            white-space: nowrap;
          }
        }
      }
    }

    .main-orders-total {
      padding: 0 20px;
      position: relative;
      overflow: hidden;

      .total-wrapper {
        border-bottom: 1px solid $gray-middle;
        padding: 10px 0 10px 0;
        transition: 0.5s ease-out;
        margin-bottom: -140.5px;

        &.active {
          margin-bottom: -10px;
          background-color: white !important;
          margin-bottom: 0rem;
        }

        .item {
          padding: 5px 0;
          border-bottom: 1px solid #eee;
          .sub-total-text {
            font-size: 14px;
          }

          .sub-total-num {
            font-size: 14px;
          }
        }
      }

      .total {
        margin: 0;
        border-top: 0px solid $gray-middle;
        color: #333;
        background-color: #fff;

        .sub-total-text {
          font-size: 14px;
        }

        .sub-total-num {
          font-size: 14px;
          display: flex;
          align-items: center;

          i {
            font-size: 22px;
            font-weight: 600;
            margin-left: 10px;
            transition: 0.3s ease-out;

            &.active {
              transform: rotate(180deg);
            }
          }
        }
      }
    }

    .mobile-footer {
      .btn-next {
        display: none;
      }
    }
  }
}
</style>
