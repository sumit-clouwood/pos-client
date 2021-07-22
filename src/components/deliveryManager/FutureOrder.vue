<template>
  <div
    class="dm-future-order dm-order-screen-change"
    id="future-order"
    v-bind:style="{ display: display_type }"
  >
    <div
      class="dm-ready-order-wrapper"
      v-bind:style="{ display: display_type }"
    >
      <Preloader :msg="_t('Loading new orders') + '...'" v-if="loading" />
      <DMItem v-else :actionDetails="actionDetails" />
    </div>
    <OrderDetailsPopup />
  </div>
</template>

<script>
import DMItem from '@/components/deliveryManager/content/DMItem'
import { mapState } from 'vuex'
import Preloader from '@/components/util/progressbar'
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'
export default {
  name: 'FutureOrder',
  data() {
    return {
      actionDetails: {
        moreDetails: false,
        actionLabel: ['Process Now'],
        action: ['process_now'],
        nextOrderStatus: 'in-progress',
      },
      interval: null,
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.$store.dispatch('deliveryManager/fetchDMOrderDetail')
    }, 1500 * 61)
  },
  destroyed() {
    clearInterval(this.interval)
  },
  computed: {
    ...mapState('deliveryManager', ['params', 'loading']),
    display_type() {
      return this.params.pageId == 'future' ? 'grid' : 'none'
    },
  },
  components: {
    Preloader,
    DMItem,
    OrderDetailsPopup,
  },
}
</script>

<style scoped></style>
