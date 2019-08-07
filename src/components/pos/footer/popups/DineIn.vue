<template>
    <!-- Dining option Model -->
    <div class="modal fade" id="dining-option" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content color-dashboard-background">
                <div class="modal-header customer-header color-secondary">
                    <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
                    <h4 class="customer-title color-text-invert">
                        {{ _t('Dinning Option') }}
                    </h4>
                </div>
                <div class="modal-body dining-options-block">
                    <div class="dining-option-block">
                        <div
                                class="option-contain"
                                :class="{ active: selectedOrderType.OTApi === 'dine_in' }"
                                @click="setOrderType({ OTview: 'Dine In', OTApi: 'dine_in' })"
                        >
                            <img src="img/pos/dine-in.svg"/><span
                                class="color-text-invert"
                        >{{ _t('Dine In') }}</span
                        >
                        </div>
                        <div
                                class="option-contain"
                                :class="{ active: selectedOrderType.OTApi === 'takeaway' }"
                                @click="
                setOrderType({
                  OTview: 'Take Away',
                  OTApi: 'takeaway',
                })
              "
                        >
                            <img src="img/pos/take-away.svg"/><span
                                class="color-text-invert"
                        >
                {{ _t('Take Away') }}
              </span>
                        </div>
                        <div
                                class="option-contain"
                                :class="{ active: selectedOrderType.OTApi === 'call_center' }"
                                @click="
                setOrderType({ OTview: 'Delivery', OTApi: 'call_center' })
              "
                        >
                            <img src="img/pos/delivery-icon.svg"/><span
                                class="color-text-invert"
                        >
                {{ _t('Delivery') }}
              </span>
                        </div>
                        <div
                                class="option-contain"
                                :class="{ active: selectedOrderType.OTApi === 'event' }"
                                @click="setOrderType({ OTview: 'Event', OTApi: 'event' })"
                        >
                            <img src="img/pos/event.svg"/><span class="color-text-invert">{{
                _t('Event')
              }}</span>
                        </div>
                        <div
                                class="option-contain"
                                :class="{ active: selectedOrderType.OTApi === 'walk_in' }"
                                @click="setOrderType({ OTview: 'Walk In', OTApi: 'walk_in' })"
                        >
                            <img src="img/pos/walkin.svg" width="35"/><span
                                class="color-text-invert"
                        >{{ _t('Walk In') }}</span
                        >
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="btn-announce">
                        <button
                                class="btn btn-success btn-large color-main color-text-invert"
                                type="button"
                                data-dismiss="modal"
                                id="dining-opt"
                                @click="updateOrderType()"
                        >
                            {{ _t('Ok') }}
                        </button>
                        <!--<button
                          class="btn btn-large"
                          type="button"
                          :class="{ active: selectedOrderType.OTApi === 'event' }"
                          @click="setOrderType({ OTview: 'Walk In', OTApi: 'walk_in' })"
                        >
                          {{ _t('Walk In') }}
                        </button>-->
                    </div>
                    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
                </div>
            </div>
        </div>
    </div>
    <!-- End Dining option model -->
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import * as CONST from '@/constants'

    export default {
        name: 'DineIn',
        props: {},
        data: function () {
            return {
                selectedOrderType: this.$store.state.order.orderType,
            }
        },
        computed: {
            ...mapGetters('location', ['_t']),
            ...mapState('order', ['orderType']),
        },
        watch: {
            orderType(newVal, oldVal) {
                if (newVal != oldVal && newVal.OTApi != CONST.ORDER_TYPE_CALL_CENTER) {
                    this.$store.dispatch('customer/reset')
                }
                this.selectedOrderType = newVal
            },
        },

        methods: {
            setOrderType(orderType) {
                if (orderType.OTApi == 'walk_in') {
                    this.updateOrderType()
                }
                if (orderType.OTApi != 'call_center') {
                    this.$store.commit('order/ORDER_TYPE', orderType)
                    this.$store.commit('location/SET_MODAL', '#manage-customer')
                    this.$store.dispatch('customer/resetCustomer')
                }
                if (this.selectedOrderType === orderType.OTApi) {
                    //toggle
                    this.selectedOrderType = {OTview: 'Walk In', OTApi: 'walk_in'}
                } else {
                    this.selectedOrderType = orderType
                }
            },
            updateOrderType() {
                this.$store.dispatch('order/updateOrderType', this.selectedOrderType)
            },
        },
    }
</script>
<style lang="scss">
    @import '../../../../assets/scss/pixels_rem.scss';
    @import '../../../../assets/scss/variables.scss';
    @import '../../../../assets/scss/mixins.scss';

    @include responsive(mobile) {
        #dining-option {
            .modal-dialog {
                margin: 0;

                .modal-content {
                    .modal-header {
                        height: 80px;
                        background-color: #fff;
                    }

                    .modal-body {
                        .dining-option-block {
                            .option-contain {
                                position: relative;

                                &.active {
                                    border: 2px solid $green-middle;

                                    &::after {
                                        content: '✔';
                                        color: #fff;
                                        background-color: $green-middle;
                                        position: absolute;
                                        top: 0;
                                        right: 0;
                                        border-radius: 0;
                                        border-bottom-left-radius: 3px;
                                    }
                                }
                            }
                        }
                    }

                    .modal-footer {
                        .btn-announce {
                            button {
                                background-color: $green-middle;
                                border: none;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
