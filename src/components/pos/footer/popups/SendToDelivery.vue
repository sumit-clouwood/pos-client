<template>
    <!-- order confrmation  -->
    <div class="modal fade" id="order-confirmation" role="dialog">
        <div class="modal-dialog" :class="{ 'error-dialog': !cartItems }">
            <!-- Modal content-->
            <div class="modal-content color-dashboard-background" v-if="cartItems">
                <SendToDeliveryHeader/>
                <SendToDeliveryContent/>
                <SendToDeliveryFooter/>
            </div>
            <div
                    class="modal-content text-center text-danger pt-3 color-dashboard-background"
                    v-else
            >
                <div class="order-header">
                    <h4 class="order-confirm-title">
                        {{ _t('No items added to order') }}
                    </h4>
                    <p>
                        {{
                        _t('Please add some item(s) to order before sending to delivery')
                        }}
                    </p>
                </div>
                <div class="modal-body order-confirmation-wrap"></div>
                <div class="modal-footer">
                    <div class="btn-announce">
                        <button
                                type="button"
                                class="btn btn-danger cancel-announce color-button"
                                data-dismiss="modal"
                        >
                            {{ _t('Close') }}
                        </button>
                    </div>

                    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
                </div>
            </div>
        </div>
    </div>
    <!-- End Order confirmation  -->
</template>

<script>
    import SendToDeliveryHeader from './SendToDelivery/SendToDeliveryHeader'
    import SendToDeliveryContent from './SendToDelivery/SendToDeliveryContent'
    import SendToDeliveryFooter from './SendToDelivery/SendToDeliveryFooter'
    import {mapState, mapGetters} from 'vuex'

    export default {
        name: 'SendToDelivery',
        props: {},
        components: {
            SendToDeliveryHeader,
            SendToDeliveryContent,
            SendToDeliveryFooter,
        },
        computed: {
            ...mapGetters('location', ['_t']),
            ...mapState({
                cartItems: state =>
                    state.order.items.length > 0 ? state.order.items : false,
            }),
        },
    }
</script>
<style lang="scss" scoped>
    @import '../../../../assets/scss/pixels_rem.scss';
    @import '../../../../assets/scss/variables.scss';
    @import '../../../../assets/scss/mixins.scss';

    .error-dialog {
        height: 280px !important;

        .order-header {
            p {
                font-size: inherit;
            }
        }
    }

    @include responsive(mobile) {
        #order-confirmation {
            .modal-dialog {
                margin: 0;

                .modal-content {
                    .order-header {
                        margin: 0;
                        padding: 20px;
                        h4{
                            text-align: left;
                        }
                    }

                    .modal-body {

                    }

                    .modal-footer {

                    }
                }
            }
        }
    }
</style>
