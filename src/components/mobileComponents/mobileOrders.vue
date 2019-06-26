<template>
    <cart/>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import cart from '../pos/content/Cart.vue'

    export default {
        name: "mobileOrders",
        components: {
            cart
        }
    }
</script>

<style lang="scss">

</style>