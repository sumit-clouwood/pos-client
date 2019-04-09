<template>
<div class="ready-order-wraper-left">
    <div class="dm-contain-order">
        <div class="dm-deliver-detail">
            <h4>2231341</h4>
            <p>Meat Ball Pasta Combo</p>
            <h4>AL NOAF 3</h4>
            <p>Box 2456, Street 7, Sharjah</p>
        </div>
        <div class="dm-deliver-detail-right">
            <p class="dm-amt">40.00 AED</p>
            <p class="dm-time">03:41 PM</p>

            <button id="ready"><span v-if="actionDetails.moreDetails" data-toggle="modal" data-target="#delivery-manager">More details</span><a href="#" v-if="actionDetails.action">{{ actionDetails.action }}</a></button>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'DMItem',
  props: {
    itemDetails: Object,
    actionDetails: Object
  }
}
</script>

<style scoped>

</style>