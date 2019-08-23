<template>
    <div id="payment-method" :class="{ activePayMethod: !payNowCalcHendler }">
        <div
                v-for="(method, key) in methods"
                :key="key"
                :class="{ active: activeMethod == method.name, 'color-secondary': true }"
                @click="[setMethod(method), methodCardHendlerGhange(method.priority)]"
                class="method"
                :data-toggle="getToggle(method)"
                :data-target="getTarget(method)"
        >
            <img :src="image(method.icon)" :alt="method.name" :title="method.name"/>
            <label
                    class="shorten-sentence text-center color-text-inverse"
                    :title="method.name"
            >
                {{ method.name }}
            </label>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex'
    import * as CONSTANTS from '@/constants'

    export default {
        name: 'PaymentMethods',
        computed: {
            ...mapGetters('payment', ['methods']),
            ...mapGetters(['payNowCalcHendler']),
            ...mapState({
                activeMethod: state => state.checkoutForm.method.name,
            }),
            ...mapState({
                selectedModal: state => state.location.setModal,
            }),
        },
        methods: {
            getToggle(method) {
                if (method.type == CONSTANTS.LOYALTY) {
                    return 'modal'
                }
                return ''
            },
            image(imgPath) {
                // return process.env.BASE_URL + imgPath
                if (imgPath) {
                    if (imgPath.indexOf('https://') != -1) {
                        return imgPath
                    } else {
                        return process.env.BASE_URL + imgPath
                    }
                } else {
                    return 'https://fakeimg.pl/46x46/?text=Third&font=lobster%22'
                }
            },
            getTarget(method) {
                if (this.$store.getters['checkoutForm/payable'] > 0) {
                    if (method.type == CONSTANTS.LOYALTY) {
                        if (this.selectedModal == '#manage-customer') {
                            return '#search-loyalty-customer'
                        } else {
                            this.$store.dispatch('checkoutForm/calculateSpendLoyalty')
                            return '#loyalty-payment'
                        }
                    }
                }
                return ''
            },
            ...mapActions('checkoutForm', ['setMethod']),
            methodCardHendlerGhange(e) {
                this.$store.dispatch('chooseCurentPayMethod', e)
            },
        },
    }
</script>
<style lang="scss">

    @import '../../../../../assets/scss/pixels_rem.scss';
    @import '../../../../../assets/scss/variables.scss';
    @import '../../../../../assets/scss/mixins.scss';

    #payment-method {
        img {
            height: 46px
        }
        /*display: flex;*/
        /*align-items: center;*/
        /*justify-content: flex-start;*/
        /*user-select: none;*/
    }

    @include responsive(mobile) {
        #payment-method {
            margin: 0;
            overflow: auto;
            display: grid;
            grid-template-rows: repeat(20, 65px);
            grid-gap: 15px;
            margin-top: 20px;

            &::-webkit-scrollbar {
                width: 0;
            }

            > div {
                display: grid;
                grid-template-columns: max-content 1fr;
                align-items: center;
                grid-gap: 20px;
                border: 2px solid $gray-middle;
                transition: 0.3s ease-out;
                border-radius: 5px;
                position: relative;

                &.active {
                    border: 2px solid $green-middle;

                    &:after {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        content: "\f00c";
                        font-family: FontAwesome;
                        position: absolute;
                        width: 20px;
                        height: 20px;
                        top: -2px;
                        right: -2px;
                        border-bottom-left-radius: 3px;
                        border-top-right-radius: 3px;
                        background-color: $green-middle;
                        color: #fff;
                    }
                }

                &:active {
                    background-color: #eee;
                }

                br {
                    display: none;
                }

                label {
                    width: auto;
                    text-align: left !important;
                    margin: 0;
                }

                img {
                    width: 50px;
                    height: 50px;
                    margin-left: 5px;
                    border-radius: 3px;
                }
            }


        }
    }


</style>
