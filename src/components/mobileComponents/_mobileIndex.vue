<template>
    <div class="mobile-components">
        <mobile-notification/>
        <profile-sidebar/>
        <mobile-page/>
        <mobile-payment-methods/>
        <mobile-orders/>
        <mobile-calc/>
        <mobile-manage-customer/>
        <payment-successfull/>
        <cashier/>
        <pay-methods/>
    </div>
</template>
<script>
    import mobileNotification from './mobileNotification.vue'
    import profileSidebar from './mobileProfileSidebar.vue'
    import mobilePaymentMethods from './choosePayMethods.vue'
    import mobilePage from './mobilePage.vue'
    import mobileOrders from './mobileOrders.vue'
    import mobileCalc from './mobileCalc.vue'
    import mobileManageCustomer from './mobileManageCustomer.vue'
    import paymentSuccessfull from './paymentSuccessfull.vue'
    import cashier from './cashier.vue'
    import payMethods from './payMethods.vue'

    export default {
        components: {
            mobileNotification,
            profileSidebar,
            mobilePage,
            mobilePaymentMethods,
            mobileOrders,
            mobileCalc,
            mobileManageCustomer,
            paymentSuccessfull,
            cashier,
            payMethods
        }
    }
</script>
<style lang="scss">
    @import '../../assets/scss/pixels_rem.scss';
    @import '../../assets/scss/variables.scss';
    @import '../../assets/scss/mixins.scss';

    .mobile-components {
        z-index: 50;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: none;
        letter-spacing: 0.5px;
        @include responsive(mobile) {
            display: block;
        }
    }
</style>