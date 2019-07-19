<template>
    <div :class="['mobile-payment-methods', {active: paymentMethodsHendler}]">
        <mobile-pay-header :param="{title: 'Order Payment', subtitle: 'Order ID #0213232', method: 'closePayMethods'}"/>
        <div class="pay-body">
            <total-amount :param="{totalAmountBlock: false}"/>
            <payment-methods/>
        </div>
        <div class="pay-footer">
            <mobile-footer :param="{method: 'successfull'}"/>
        </div>
    </div>
</template>
<script>
    import {mapState, mapGetters} from 'vuex'
    import mobileFooter from './mobileFooter.vue'
    import mobilePayHeader from './mobilePayHeader.vue'
    import paymentMethods from '../pos/content/cart/payNow/PaymentMethods.vue'
    import totalAmount from '../pos/content/cart/payNow/TotalAmount.vue'

    export default {
        components: {
            mobileFooter,
            paymentMethods,
            totalAmount,
            mobilePayHeader,
        },
        computed: {
            ...mapGetters(['paymentMethodsHendler']),
        },
        methods: {}
    }
</script>
<style lang="scss">
    @import '../../assets/scss/pixels_rem.scss';
    @import '../../assets/scss/variables.scss';
    @import '../../assets/scss/mixins.scss';

    @include responsive(mobile) {
        .mobile-payment-methods {
            z-index: 1051;
            position: fixed;
            top: 0;
            right: -100vw;
            bottom: 0;
            background-color: #fff;
            display: grid;
            grid-template-rows: 90px 1fr max-content;
            width: 100vw;
            transition: 0.5s ease-out;

            &.active {
                right: 0;
            }

            .pay-body {
                padding: 0 20px;
                display: grid;
                grid-template-rows: max-content 1fr;
                overflow: auto;

                #payment-method {
                    margin: 20px 0 0 0;
                    overflow: auto;
                    display: grid;
                    grid-template-rows: repeat(20, 65px);
                    grid-gap: 15px;

                    > div {
                        display: grid;
                        grid-template-columns: max-content 1fr;
                        align-items: center;
                        grid-gap: 20px;
                        border: 1px solid $gray-middle;
                        transition: 0.3s ease-out;

                        &.active {
                            border: 1px solid $green-middle;
                        }

                        &:active {
                            background-color: #eee;
                        }

                        br {
                            display: none;
                        }

                        label {
                            width: auto;
                            text-align: left;
                            margin: 0;
                        }

                        img {
                            width: 63px;
                            height: 63px;
                        }
                    }
                }
            }

            .pay-footer {
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

                .mobile-footer {
                    .btn-cart {
                        display: none;
                    }
                }
            }
        }
        .total-amount {
            border: 1px dotted $green-middle;
            border-radius: $card-border-radius;
            padding: 20px;
            background-color: $green-light;
            display: grid;
            grid-template-columns: 1fr max-content;
            font-weight: 600;

            .payment-amount-title {
                display: flex;
                justify-content: center;
                flex-direction: column;

                .tip-amopunt {
                    margin-bottom: 5px;
                }

                .total-amt {
                    color: $green-dark;
                    margin-top: 3px;
                }
            }

            .payment-amount-digit {
                display: flex;
                justify-content: center;
                flex-direction: column;

                p {
                    margin-bottom: 5px;
                    text-align: right;
                }

                h2 {
                    font-size: 20px;
                    font-weight: 600;
                    color: $green-dark;
                    margin: 0;
                    text-align: right;
                }
            }
        }
    }
</style>