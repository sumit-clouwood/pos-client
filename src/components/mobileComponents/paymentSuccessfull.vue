<template>
    <div class="payment-successfull">
        <div class="header">
            <mobile-pay-header/>
        </div>
        <div class="body">
            <total-amount/>
        </div>
        <pay-footer/>
    </div>
</template>

<script>
    import payFooter from '../pos/content/cart/payNow/Footer.vue'
    import totalAmount from '../pos/content/cart/payNow/TotalAmount.vue'
    import mobilePayHeader from './mobilePayHeader.vue'

    export default {
        name: "paymentSuccessfull",
        components: {
            payFooter,
            totalAmount,
            mobilePayHeader
        }
    }
</script>

<style lang="scss">
    @import '../../assets/scss/pixels_rem.scss';
    @import '../../assets/scss/variables.scss';
    @import '../../assets/scss/mixins.scss';

    .payment-successfull {
        position: fixed;
        top: 0;
        right: -100vw;
        bottom: 0;
        width: 100vw;
        z-index: 50;
        background-color: #fff;
        display: grid;
        grid-template-rows: max-content 1fr max-content;

        .body {
            padding: 20px;
        }

        .payment-screen-footer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 20px;
            padding: 20px;
            min-width: auto;

            .footer-wrap {
                color: #fff;
                background-color: $btn-bg-black;
                display: grid;
                align-items: center;
                justify-content: center;
                padding: 10px;
                border-radius: $btn-border-radius;
                &:last-child{
                    background-color: $green-middle;
                }

                img {
                    margin: 0 auto;
                    margin-bottom: 5px;
                }
            }
        }
    }
</style>