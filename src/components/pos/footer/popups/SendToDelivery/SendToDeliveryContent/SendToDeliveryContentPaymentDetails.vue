<template>
    <div id="total-order-wrap" class="total-order">
        <div class="order-notes">
            <p class="notes-title">NOTES</p>
            <p>Lorem Ipsum is simply dummy text
                of the printing and typesetting
                industry porto.</p>
        </div>
        <div class="order-confirm-amt" id="total-confirm-order">
            <div class="order-amt-title">
                <p>SUBTOTAL :</p>
                <p>SURCHARGE :</p>
                <p>ORDER DISCOUNT :</p>
                <p>TAX :</p>
                <p>BILL AMOUNT :</p>
            </div>
            <div class="order-amt-charges">
                <p>INR 42.00</p>
                <p>INR 0.00</p>
                <p>INR 0.00</p>
                <p>INR 0.00</p>
                <p>INR 42.00</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'SendToDeliveryContentPaymentDetails',
        props:{}
    }
</script>