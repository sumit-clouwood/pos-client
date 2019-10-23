<template>
  <div class="left-container orders">
    <Preloader v-if="loading" />
    <div v-else>
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
import RunningOrders from './content/RunningOrders'
import CompletedOrders from './content/CompletedOrders'

export default {
  name: 'Content',
  computed: {
    ...mapState('carhop', ['loading', 'orderStatus', 'orders']),
  },
  components: {
    Preloader,
    RunningOrders,
    CompletedOrders,
  },
  mounted() {
    this.$store.dispatch('carhop/initFetch')
  },
}
</script>
<style lang="scss">
@import '../../assets/scss/variables.scss';

.orders {
  .carhop-running-orders-wrapper {
    overflow: auto;
    width: calc(100vw - 20px);
  }

  span.dinefor-paynow {
    width: auto;
    border-radius: 0.25rem;
    background-color: $blue-middle;
    display: inline-block;
    padding: 0.375rem 0.625rem;
    margin-left: 0.5rem;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    vertical-align: middle;
    svg {
      height: 14px;
    }
    > svg {
      margin-right: 0.625rem;
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
    font-size: $px14;
    line-height: 1.8;
    font-weight: 700;
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
</style>
