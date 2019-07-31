<template>
    <!-- Modal -->
    <div
            class="modal fade POSItemOptions"
            id="POSItemOptions"
            tabindex="-1"
            role="dialog"
            aria-labelledby="POSItemOptions"
            aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content color-dashboard-background">
                <Header/>
                <HeaderDetails/>
                <Content/>
                <Footer/>
            </div>
        </div>
    </div>
    <!-- End Model -->
</template>

<script>
    import Header from './popup/Header'
    import HeaderDetails from './popup/header/HeaderDetails'
    import Content from './popup/Content'
    import Footer from './popup/Footer'

    export default {
        name: 'Popup',
        props: {},
        components: {
            Content,
            Header,
            HeaderDetails,
            Footer,
        },
    }
</script>
<style lang="scss">
    @import '../../../../../assets/scss/pixels_rem.scss';
    @import '../../../../../assets/scss/variables.scss';
    @import '../../../../../assets/scss/mixins.scss';

    @include responsive(mobile) {
        .POSItemOptions {
            padding: 0;

            .modal-dialog {
                width: 100vw;
                max-width: none;
                min-width: 100vw;

                .modal-content {
                    display: grid;
                    grid-template-rows: max-content max-content max-content max-content;
                    .modal-header {
                        height: 70px;
                        background-color: #fff;
                        margin: 0;
                    }

                    .modal-details {
                        padding: 0 25px;
                        border: none;

                        .POSItemOptions_pricequantity {
                            .POSItemOptions_price {
                                .POSItemOptions_money {
                                    color: #6EC841;
                                }
                            }

                            .POSItemOptions_quantity {
                                position: fixed;
                                bottom: 0;
                                right: 0;
                                left: 0;
                                padding: 20px;
                                box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
                                width: 100%;
                                height: 75px;
                                background-color: #fff;
                                z-index: 1;

                                .POSItemOptions_label {
                                    display: none;
                                }


                            }
                        }
                    }

                    .modal-body {
                        margin: 0;
                        border-top: 1px solid #ccc;

                        .POSItemOption {
                            margin-bottom: 20px;

                            .POSItemOptions_type {
                                .POSItemOptions_typehead {
                                    .color-text-invert {
                                        text-transform: uppercase;
                                    }
                                }

                                .POSItemOptions_typeline {
                                    display: none;
                                }
                            }

                            .POSItemOptions_choose {
                                margin-top: 20px;
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                grid-gap: 20px;

                                .POSItemOptions_choose_choice {
                                    width: auto;
                                    margin-bottom: 0;

                                    .POSItemOptions_choose_label {
                                        padding: 10px;
                                        border: 1px solid #ccc;
                                        border-radius: 5px;
                                        position: relative;
                                        display: flex;
                                        align-items: center;

                                        img {
                                            flex-basis: max-content;
                                        }

                                        .customradioc {
                                            display: inline-flex;
                                            margin: 0;
                                            position: absolute;
                                            top: 0;
                                            right: 0;

                                            .color-text {
                                                line-height: inherit;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .modal-footer {
                        grid-row-start: 2;
                        grid-row-end: 3;

                        .buttoned {
                            width: auto;
                            height: 50px;
                            padding: 0 25px !important;

                            img {
                                margin-right: 10px;
                            }
                        }
                        .btn-announce{
                            display: grid;
                            grid-template-columns: 1fr 1fr 1fr;
                            margin: 0;
                            justify-content: space-between;
                            grid-gap: 10px;
                            width: 100%;
                            button{
                                margin: 0;
                                padding: 0 10px !important;
                                height: 30px;
                                box-shadow: none !important;
                            }
                        }
                    }
                }
            }

        }
    }
</style>
