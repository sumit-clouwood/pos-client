<template>
  <div
    :class="['main-orders', { active: items.length && mainOrdersHendler }]"
    class="main-orders color-dashboard-background"
  >
    <div class="main-orders-title">
      <div class="text">Current Sale Detail</div>
      <div class="button" @click="cartClose">
        <i class="fa fa-angle-right" aria-hidden="true"></i>
      </div>
    </div>
    <Header v-if="orderType.OTApi !== 'dine_in'" />
    <dineInHeader v-else />

    <div class="main-orders-list-wrapper" v-if="orderType.OTApi !== 'dine_in'">
      <HoldingOrders v-if="cartType === 'hold'" />
      <Items v-else />
    </div>
    <div class="main-orders-list-wrapper" v-else>
      <HoldingOrders v-if="cartType === 'hold'" />
      <dineInItems v-else />
    </div>
    <PayNow />
    <Footer />
    <mobile-footer />
    <orders-menu />
  </div>
</template>

<script>
import Header from './cart/newOrders/Header'
import HoldingOrders from './cart/HoldingOrders'
import Footer from './cart/Footer'
import PayNow from './cart/PayNow'
import Items from './cart/newOrders/Items'
import ordersMenu from '../../mobileComponents/mobileOrdersMenu'
import mobileFooter from '../../mobileComponents/mobileFooter'
import dineInItems from '@/components/dinein/cart/Items'
import dineInHeader from '@/components/dinein/cart/Header'

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Cart',
  props: {
    msg: String,
  },
  computed: {
    ...mapState('checkout', ['order']),
    ...mapGetters('order', ['items']),
    ...mapGetters(['mainOrdersHendler']),
    ...mapState('order', ['cartType', 'orderType']),
  },
  methods: {
    cartClose() {
      this.$store.dispatch('cartClose')
    },
  },
  components: {
    Header,
    dineInHeader,
    Items,
    HoldingOrders,
    Footer,
    PayNow,
    ordersMenu,
    dineInItems,
    mobileFooter,
  },
}
</script>
<style lang="scss">
@import '../../../assets/scss/pixels_rem.scss';
@import '../../../assets/scss/variables.scss';
@import '../../../assets/scss/mixins.scss';
.main-orders {
}
@include responsive(mobile) {
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

    &.active {
      right: 0px;
    }

    .main-orders-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      padding-bottom: 0;
      font-weight: 600;
      font-size: 18px;
      z-index: 6;
      background-color: #fff;

      .fa {
        font-size: 22px;
        font-weight: 600;
      }
    }

    .main-orders-contacts {
      margin: 0;
      padding: 0 20px 20px 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 1;

      .main-oreders-title {
        font-size: 14px;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .main-oreders-date {
        text-align: right;
      }

      .main-oreders-buttons {
        display: none;
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
      z-index: -1;

      .total-wrapper {
        border-bottom: 1px solid $gray-middle;
        padding: 10px 0 10px 0;
        transition: 0.5s ease-out;
        margin-bottom: -167.5px;
        word-break: break-all;

        &.active {
          margin-bottom: -10px;
        }

        .item {
          padding: 5px 0;
          border-bottom: 1px solid #eee;

          .sub-total-text {
            font-size: 14px;
            overflow: hidden;
            max-width: 200px;
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
      padding-top: 0;
      background-color: #fff;
      z-index: 10;
      padding-top: 20px;
      box-shadow: none;

      .btn-cart {
        display: none;
      }

      .main-orders-buttons {
        display: grid;
      }

      .btn-next {
        display: none;
      }
    }
  }
}
</style>
