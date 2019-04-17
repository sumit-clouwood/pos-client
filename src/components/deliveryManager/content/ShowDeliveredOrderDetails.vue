<template>
    <div id="delivered-data">
        <div colspan="10" class="deliveredOrderDetails">
            <div class="delivered-data-wrapper">
                <div class="table table-responsive">
                    <p style="width: 160px;">ORDER NUMBER</p>
                    <p style="width: 160px;">amount</p>
                    <p style="width: 800px;">order performance (preparation | pickup | Delivery)</p>
                    <p style="width: 150px;">total time</p>
                    <p style="width: 160px;">status</p>
                    <div class="deliverd-time-table">
                        <p>21312410</p>
                        <p>32.12 INR</p>
                        <p><span class="delivery-preptn">22 hours 30 Minutes 02</span><span class="delivery-pickup">4 seconds Pick</span><span
                                class="delivery-delivered">5 seconds Delivery</span></p>
                        <p>20 h 30 m 10 s</p>
                        <p class="delivered-btn"><span>Delivered</span></p>
                    </div>

                    <div class="delivery-avg-delivery-time">
                        <p>Total Deliveries : <span class="total-delivery">3</span></p>
                        <p>Total : <span class="delivery-time-total">32.12 INR</span></p>
                        <p>Average Delivery Time : <span class="dm-avg-delivery-time">00:00:04</span></p>
                        <p></p>
                        <p></p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
  name: 'ShowDeliveredOrderDetails',
}
</script>

<style scoped>

</style>