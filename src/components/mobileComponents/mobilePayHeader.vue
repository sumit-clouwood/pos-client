<template>
    <div class="pay-header">
        <div class="pay-header-title">{{param.title}}</div>
        <div class="pay-header-subtitle">{{param.subtitle}}</div>
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
</template>

<script>
    export default {
        name: "mobilePayHeader",
        props: ['param'],
        methods: {
            paymentMethodsHendlerGhange() {
                if (this.param.method == 'closePayMethods') {
                    this.$store.dispatch('paymentMethodsHendlerGhange')
                } else if (this.param.method == 'calcHendler') {
                    this.$store.dispatch('payNowCalcHendlerGhange')
                }else if (this.param.method == 'payCartHendler') {
                    this.$store.dispatch('payNowCalcHendlerGhange')
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '../../assets/scss/pixels_rem.scss';
    @import '../../assets/scss/variables.scss';
    @import '../../assets/scss/mixins.scss';

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
</style>