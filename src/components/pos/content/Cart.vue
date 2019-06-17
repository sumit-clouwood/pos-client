<template>
    <div :class="['main-orders', {active: mainOrdersHendler}]">
        <div class="main-orders-title">
            <div class="text">Current Sale Detail</div>
            <div class="button" @click="cartClose"><i class="fa fa-angle-up" aria-hidden="true"></i></div>
        </div>
        <Header/>
        <div class="main-orders-list-wrapper">
            <Items/>
            <HoldingOrders/>
        </div>
        <PayNow v-show="order"/>
        <Footer/>
    </div>
</template>

<script>
    import Header from './cart/newOrders/Header.vue'
    import HoldingOrders from './cart/HoldingOrders'
    import Footer from './cart/Footer'
    import PayNow from './cart/PayNow'
    import Items from './cart/newOrders/Items.vue'

    import {mapState, mapGetters} from 'vuex'

    export default {
        name: 'Cart',
        props: {
            msg: String,
        },
        computed: {
            ...mapState('checkout', ['order']),
            ...mapGetters(['mainOrdersHendler'])
        },
        methods: {
            cartClose() {
                this.$store.dispatch('cartClose')
            }
        },
        components: {
            Header,
            Items,
            HoldingOrders,
            Footer,
            PayNow,
        },
    }
</script>
<style lang="scss">
    @import '../../../assets/scss/pixels_rem.scss';
    @import '../../../assets/scss/variables.scss';
    @import '../../../assets/scss/mixins.scss';

    @include responsive(mobile) {
        .main-orders {
            position: fixed;
            top: -100%;
            right: 0;
            bottom: 0;
            left: 0px;
            padding: $px20;
            height: 100%;
            background-color: #fff;
            padding: 0;
            grid-template-rows: max-content max-content 1fr;
            overflow: hidden;
            transition: 0.7s ease-out;
            border-bottom: 1px solid $gray-middle;
            grid-column-start: 1;
            grid-column-end: 2;
            z-index: 51;

            &.active {
                top: 0px;
            }

            .main-orders-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: $px10 $px20 0;
                font-weight: 600;
                font-size: $px20;

                .fa {
                    font-size: $px22;
                    font-weight: 600;
                }
            }

            .main-orders-contacts {
                margin: 0;
                padding: 0 $px20 0 $px20;

                .main-oreders-title {
                    font-size: $px16;
                }

                .main-oreders-date {
                    text-align: right;
                }

                .main-oreders-buttons {
                    display: none;
                }
            }

            .main-orders-list-wrapper {
                padding: 0;

                .main-orders-list {
                    grid-gap: 0;

                    .main-orders-list-item {
                        border-radius: 0;
                        border: none;
                        border-bottom: 1px solid $gray-middle;
                        padding: $px5 0;
                        margin: 0 $px20;

                        .main-orders-list-item-title {
                            white-space: nowrap;
                        }
                    }
                }
            }

            .main-orders-total {
                padding: 0 $px20;
                position: relative;

                .total-wrapper {
                    border-top: 1px solid $gray-middle;
                    padding: $px10 0;
                    transition: 0.5s ease-out;
                    margin-bottom: -90.5px;

                    &.active {
                        margin-bottom: 0;
                    }

                    .item {
                        .sub-total-text {
                            font-size: $px14;
                        }

                        .sub-total-num {
                            font-size: $px14;
                        }
                    }
                }


                .total {
                    margin: 0;
                    border-top: 1px solid $gray-middle;
                    color: #333;
                    background-color: #fff;

                    .sub-total-text {
                        font-size: $px14;
                    }

                    .sub-total-num {
                        font-size: $px14;
                        display: flex;
                        align-items: center;

                        i {
                            font-size: $px22;
                            font-weight: 600;
                            margin-left: $px10;
                            transition: 0.3s ease-out;

                            &.active {
                                transform: rotate(180deg);
                            }
                        }
                    }
                }
            }

        }
    }
</style>
