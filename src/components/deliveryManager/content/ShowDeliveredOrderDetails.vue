<template>
    <tr id="delivered-data" style="display:none" class="delivered-data">
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
                    <tr class="deliverd-time-table" v-for="(order, index) in orders.driverOrders" :key="index">
                        <td> {{ order.orderNumber }}</td>
                        <td>{{ order.orderAmount }}</td>
                        <td>
                            <span class="delivery-preptn">{{order.orderPreparationTimeDifference}}</span>
                            <span class="delivery-pickup">{{order.orderPickupTimeDifference}} Pick</span>
                            <span class="delivery-delivered">{{order.orderDeliveryTimeDifference}} Delivery</span>
                         </td>
                        <td>{{order.orderTotalTime}}</td>
                        <td class="delivered-btn"><span>{{order.orderStatus}}</span></td>
                    </tr>

                    <tr class="delivery-avg-delivery-time">
                        <td>Total Deliveries : <span class="total-delivery">{{orders.noOfOrders}}</span></td>
                        <td>Total : <span class="delivery-time-total">{{orders.orderSum}}</span></td>
                        <td>Average Delivery Time : <span class="dm-avg-delivery-time">{{orders.averageDeliveryTime}}</span></td>
                        <td></td>
                        <td></td>

                    </tr>


                    </tbody></table>
            </div>
        </td>

    </tr>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ShowDeliveredOrderDetails',
  computed: {
    ...mapState({
      orders: state=> state.deliveryManager.moreOrders
    })
  }
}


</script>

<style scoped>
/* */
.delivered-btn > span {
    border-radius: 6px;
    background-color: #47cd8f;
    display: inline-block;
    padding: 8px 10px;
    color: #fff;
    font-size: 14px;
    text-transform: capitalize;
}
.delivered-data-wrapper .table {
    background-color: #f7f8fa;
    border-radius: 8px;
}
.delivery-avg-delivery-time {
    background-color: #eef0f3;
}
.delivered-data-wrapper .table {
    background-color: #f7f8fa;
    border-radius: 8px;
}
.deliverd-time-table {
    height: 80px;
    vertical-align: middle;
}
.deliverd-time-table_header p,.delivered-data-wrapper p {
    display: inline-block;
}
.delivered-data-wrapper > .table p {
    letter-spacing: 0.4px;
    color: #a4a4a4;
    font-size: 12px !important;
    text-transform: uppercase;
}
.delivered-data-wrapper > .table div p {
    letter-spacing: 0.4px;
    color: #a4a4a4;
    font-size: 12px !important;
    text-transform: uppercase;
}
.delivery-avg-delivery-time{
    height: 109px;
}
.delivered-data-wrapper > .table p {
    letter-spacing: 0.4px;
    color: #a4a4a4;
    font-size: 12px !important;
    text-transform: uppercase;
}
.table {
    padding: .75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}
.deliverd-time-table_header {
    display: flex;
}
.delivery-avg-delivery-time p span {
    display: block;
    letter-spacing: 0.6px;
    color: #3a3d44;
    font-size: 20px;
    font-weight: 600;
}
.delivered-data-wrapper .table p.delivered-btn > span {
    border-radius: 6px;
    background-color: #47cd8f;
    display: inline-block;
    padding: 8px 10px;
    color: #fff;
    font-size: 14px;
    text-transform: capitalize;
}
.delivery-avg-delivery-time p {
    letter-spacing: 0.6px;
    color: #3a3d44 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
}
.deliverd-time-table {
    /*display: flex;*/
    justify-content: space-between;
}
.delivery-avg-delivery-time {
    /*display: flex;*/
    justify-content: space-between;
}
span.delivery-preptn {
    border-radius:4px;
    background-color:#f35c7f;
    display:inline-block;
    padding:2px 5px;
    color:#fff;
    font-size:12px;
    border-top-right-radius:0;
    border-bottom-right-radius:0;
    float:left;
}
span.delivery-pickup {
    background-color:#7881d5;
    padding:2px 5px;
    color:#fff;
    font-weight:600;
    font-size:12px;
    /* border-radius: 4px; */
    display:inline-block;
    float:left;
}
span.delivery-delivered {
    border-radius:4px;
    background-color:#47cd8f;
    font-size:12px;
    font-weight:600;
    display:inline-block;
    padding:2px 5px;
    color:#fff;
    border-top-left-radius:0;
    border-bottom-left-radius:0;
    float:left;
}
tr.delivery-avg-delivery-time td span {
    display: block;
    letter-spacing: 0.6px;
    color: #3a3d44;
    font-size: 20px;
    font-weight: 600;
}
tr.delivery-avg-delivery-time td {
    letter-spacing: 0.6px;
    color: #3a3d44 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
}
tr.delivery-avg-delivery-time td {
    height: 109px;
    vertical-align: middle;
}
</style>