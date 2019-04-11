<template>
    <div class="dm-future-order dm-order-screen-change" id="future-order">
        <div class="dm-ready-order-wrapper-future">
            <DMItem :actionDetails="actionDetails"/>
        </div>
    </div>
</template>

<script>
import DMItem from '@/components/deliveryManager/content/DMItem'
export default {
  name: 'FutureOrder',
  data() {
    return {
      actionDetails: {'moreDetails': false, 'action': false}
    }
  },
  components: {
    DMItem,
  }
}
</script>

<style scoped>

</style>