<template>
    <div class="dm-order-details-wrap">
        <div class="dm-delivery-details-btn">
            <ul class="dm-ullist">
                <li class="active" data-related="Waiting-for-Collections"><a href="#">Waiting for Collections</a><span>10</span></li>
                <li class="pick" data-related="collected"><a href="#">Collected</a><span>66</span></li>

            </ul>
        </div>
        <div class="dm-delivery-assistants">
            <p style="height: 34px;"></p>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DMTakeAwaySubMenu',
  computed: {
    ...mapState({
      orderCount: state => state.deliveryManager.orderCounts
    })
  }
}
</script>

<style scoped>

</style>