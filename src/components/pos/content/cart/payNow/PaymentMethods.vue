<template>
    <div id="payment-method" :class="{activePayMethod: !payNowCalcHendler}">
        <div v-for="(method, key) in methods"
             :key="key"
             :class="{ active: activeMethod == method.name }"
             @click="[setMethod(method), methodCardHendlerGhange(method.name)]"
             :data-toggle="getToggle(method)"
             :data-target="getTarget(method)">
            <img :src="image(method.icon)" :alt="method.name" :title="method.name"/>
            <br/>
            <label class="shorten-sentence" :title="method.name">
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
                if (method.name == CONSTANTS.LOYALTY) {
                    return 'modal'
                }
                return ''
            },
            image() {
                return 'https://fakeimg.pl/46x46/?text=Third&font=lobster%22'
            },
            getTarget(method) {
                if (method.name == CONSTANTS.LOYALTY) {
                    if (this.selectedModal == '#manage-customer') {
                        return '#search-loyalty-customer'
                    } else {
                        this.$store.dispatch('checkoutForm/calculateSpendLoyalty')
                        return '#loyalty-payment'
                    }
                }
                return ''
            },
            ...mapActions('checkoutForm', ['setMethod']),
            methodCardHendlerGhange(e) {
                if(e == 'Payment Type Payment Type Name 202'){
                    this.$store.dispatch('methodCardHendlerGhange')
                }else if(e == 'Payment Type Payment Type Name 203'){
                    this.$store.dispatch('QRMethodGhangeHendler')
                }else if(e == 'Gift Card'){
                    this.$store.dispatch('payNowCalcHendlerGhange')
                }else if(e == 'Loyalty Points'){
                    this.$store.dispatch('loyaltyPaymentHendlerGhange')
                }
                console.log(e)
            }
        },
    }
</script>
<style lang="scss">

</style>
