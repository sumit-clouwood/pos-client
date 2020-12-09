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
  </div>
</template>

<script>
import DMItem from '@/components/deliveryManager/content/DMItem'
import { mapState } from 'vuex'
import Preloader from '@/components/util/progressbar'
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
    }
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
  },
}
</script>

<style scoped></style>
