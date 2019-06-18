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
        </div>
        <div class="pay-footer">
            <mobile-footer/>
        </div>
    </div>
</template>
<script>
    import {mapState, mapGetters} from 'vuex'
    import mobileFooter from './mobileFooter'
    import totalAmount from '../pos/content/cart/payNow/TotalAmount'

    export default {
        components: {
            mobileFooter,
            totalAmount
        },
        computed: {

        },
        methods: {

        }
    }
</script>
<style lang="scss">
    @import '../../assets/scss/pixels_rem.scss';
    @import '../../assets/scss/variables.scss';
    @import '../../assets/scss/mixins.scss';

    @include responsive(mobile) {
    }
</style>