<template>
    <div class="dm-order-details-wrap">
        <div class="dm-delivery-details-btn">
            <ul class="dm-ullist">
                <li class="active" data-related="dm-new-order"><a href="#">New Orders</a><span>60</span></li>
                <li class="pick" data-related="dm-waiting-for-pick"><a href="#">Waiting for Pick</a><span>12</span></li>
                <li class="pick" data-related="dm-delivery-in-progress"><a href="#">Delivery - In Progress</a><span>12</span></li>
                <li class="dm-delivered" data-related="dm-delivered"><a href="#">Delivered</a><span>12</span></li>
            </ul>
        </div>
        <div class="dm-delivery-assistants">
            <button id="dm-assistant" data-toggle="modal" data-target="#delivery-assistant"><span><img src="img/other/delivery-assistant.png" alt="delivery"></span> Delivery Assistant</button>
        </div>
    </div>
</template>

<script>

export default {
  name: 'DMHomeDeliverySubMenu',
}
</script>

<style scoped>

</style>