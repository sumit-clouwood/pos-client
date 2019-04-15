<template>
    <tr id="delivered-data">
        <td colspan="10" class="deliveredOrderDetails">
            <div class="delivered-data-wrapper">
                <table class="table table-responsive">
                    <tbody><tr>
                        <th style="width: 160px;">ORDER NUMBER</th>
                        <th style="width: 160px;">amount</th>
                        <th style="width: 800px;">order performance (preparation | pickup | Delivery)</th>
                        <th style="width: 150px;">total time</th>
                        <th style="width: 160px;">status</th>
                    </tr>
                    <tr class="deliverd-time-table">
                        <td>21312410</td>
                        <td>32.12 INR</td>
                        <td><span class="delivery-preptn">22 hours 30 Minutes 02</span><span class="delivery-pickup">4 seconds Pick</span><span class="delivery-delivered">5 seconds Delivery</span></td>
                        <td>20 h 30 m 10 s</td>
                        <td class="delivered-btn"><span>Delivered</span></td>
                    </tr>

                    <tr class="delivery-avg-delivery-time">
                        <td>Total Deliveries : <span class="total-delivery">3</span></td>
                        <td>Total : <span class="delivery-time-total">32.12 INR</span></td>
                        <td>Average Delivery Time : <span class="dm-avg-delivery-time">00:00:04</span></td>
                        <td></td>
                        <td></td>

                    </tr>


                    </tbody></table>
            </div>
        </td>

    </tr>
</template>

<script>
export default {
  name: 'ShowDeliveredOrderDetails',
}
</script>

<style scoped>

</style>