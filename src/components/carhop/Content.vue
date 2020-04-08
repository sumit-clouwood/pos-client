<template>
  <div class="left-container orders">
    <OrderDetailsPopup />
    <Preloader v-if="loading" />
    <div v-else>
      <progressbar
        v-if="loadingSilent"
        :init="10"
        :step="10"
        :interval="100"
        :range="150"
      ></progressbar>
      <running-orders
        :orders="orders['in-progress']"
        v-if="orderStatus == 'in-progress'"
      ></running-orders>
      <completed-orders
        v-else-if="orderStatus == 'finished'"
        :orders="orders['finished']"
      ></completed-orders>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Preloader from '@/components/util/Preloader'
import progressbar from '@/components/util/progressbar'
import RunningOrders from './content/RunningOrders'
import CompletedOrders from './content/CompletedOrders'
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'
export default {
  name: 'Content',
  computed: {
    ...mapState('carhop', [
      'loading',
      'loadingSilent',
      'orderStatus',
      'orders',
    ]),
  },
  components: {
    Preloader,
    progressbar,
    RunningOrders,
    CompletedOrders,
    OrderDetailsPopup,
  },
  data() {
    return {
      interval: null,
    }
  },
  mounted() {
    this.$store.dispatch('carhop/initFetch')
    this.interval = setInterval(() => {
      this.$store.dispatch('carhop/initFetch', false)
    }, 1000 * 20)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.orders {
  .carhop-running-orders-wrapper {
    overflow: auto;
    width: calc(100vw - 20px);
    @include responsive(mobile) {
      width: calc(100vw - 10px);
    }

    .dropdown-menu.show {
      top: inherit !important;
      @include responsive(mobile) {
        top: 0px !important;
      }
    }
  }
  .carhop-completed-orders {
    .dropdown-menu.show {
      top: inherit !important;
      @include responsive(mobile) {
        top: 0px !important;
      }
    }
  }
  span.dinefor-paynow {
    width: 100%;
    border-radius: 0.25rem;
    background-color: $blue-middle;
    display: inline-block;
    padding: 0.375rem 0.625rem;
    margin-left: 0.5rem;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
    height: 100% !important;
    > svg {
      margin-right: $px2;
      vertical-align: middle;
      width: 1.5rem;
    }
    a {
      color: inherit;
      text-decoration: none;
      display: grid;
      grid-template-columns: auto auto;

      &:hover {
        text-decoration: none;
      }
    }
  }
  .in-progress,
  .finished {
    background-color: #e73030;
    color: #fff;
    border-radius: $px4;
    display: inline-block;
    padding: $px4 $px10;
    font-size: $px16;
    @include responsive(mobile) {
      font-size: 12px;
    }
    line-height: 1.8;
  }
  .finished {
    background-color: $green;
  }
  .pagination-wrapper {
    display: block;
    overflow: hidden;
  }
  .order-number {
    padding: 0.25rem 1.25rem;
  }
  .item-name {
    padding: 0 0.625rem;
    background-color: #ef7f2a;
    color: #fff;
    height: 1.875rem;
    line-height: 1.875rem;
    display: inline-block;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 3px;
    margin-right: 0.3125rem;
    margin-bottom: 0.3125rem;
    font-size: 14px;
    -webkit-transition: 0.2s linear;
    transition: 0.2s linear;
  }
}

.button-wrapper {
  grid-template-columns: max-content 1fr;
  > a:first-child {
    margin-right: 1em;
  }
}

.button-wrapper > a span.dinefor-paynow {
  width: 100%;
  padding-left: 0;
  padding-right: 0;
  margin-right: 5px;
}
</style>
