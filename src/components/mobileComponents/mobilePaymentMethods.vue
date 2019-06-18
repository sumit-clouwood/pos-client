<template>
    <div :class="['mobile-payment-methods', {active: paymentMethodsHendler}]">
        <div class="pay-header">
            <div class="pay-header-title">Order Payment</div>
            <div class="pay-header-subtitle">Order ID #0213232</div>
            <div class="pay-header-buttons">
                <div class="button-cancel" @click="paymentMethodsHendlerGhange">
                    <div>Cansel</div>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7.70711 6.29289C8.09763 6.68342 8.09763 7.31658 7.70711 7.70711L1.70711 13.7071C1.31658 14.0976 0.683417 14.0976 0.292893 13.7071C-0.0976311 13.3166 -0.0976311 12.6834 0.292893 12.2929L5.58579 7L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"
                              fill="white"/>
                    </svg>

                </div>
            </div>
        </div>
        <div class="pay-body">
            <total-amount/>
            <payment-methods/>
        </div>
        <div class="pay-footer">
            <mobile-footer/>
        </div>
    </div>
</template>
<script>
    import {mapState, mapGetters} from 'vuex'
    import mobileFooter from './mobileFooter'
    import paymentMethods from '../pos/content/cart/payNow/PaymentMethods.vue'
    import totalAmount from '../pos/content/cart/payNow/TotalAmount'

    export default {
        components: {
            mobileFooter,
            paymentMethods,
            totalAmount
        },
        computed: {
            ...mapGetters(['paymentMethodsHendler']),
        },
        methods: {
            paymentMethodsHendlerGhange(){
                this.$store.dispatch('paymentMethodsHendlerGhange')
            }
        }
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

            .pay-header {
                display: grid;
                grid-template-columns: 1fr max-content;
                grid-template-rows: 1fr 1fr;
                align-items: center;
                padding: 20px;

                .pay-header-title {
                    font-size: 20px;
                    font-weight: 600;
                    align-self: end;
                }

                .pay-header-subtitle {
                    align-self: start;
                    font-size: 12px;
                }

                .pay-header-buttons {
                    grid-column-start: 2;
                    grid-column-end: 3;
                    grid-row-start: 1;
                    grid-row-end: 3;

                    .button-cancel {
                        padding: 0 20px;
                        width: 100%;
                        height: 50px;
                        background-color: $red;
                        color: #fff;
                        border-radius: $btn-border-radius;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        svg {
                            margin-left: 20px;
                        }
                    }
                }
            }

            .pay-body {
                padding: 0 20px;
                display: grid;
                grid-template-rows: max-content 1fr;
                overflow: auto;

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

                #payment-method {
                    margin: 20px 0 0 0;
                    overflow: auto;
                    display: grid;
                    grid-gap: 15px;

                    > div {
                        display: grid;
                        grid-template-columns: max-content 1fr;
                        align-items: center;
                        grid-gap: 20px;
                        border: 1px solid $gray-middle;

                        br {
                            display: none;
                        }

                        label {
                            width: auto;
                            text-align: left;
                            margin: 0;
                        }
                    }
                }
            }

            .pay-footer {
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                .mobile-footer{
                    .btn-cart{
                        display: none;
                    }
                }
            }
        }
    }
</style>