<template>
    <div class="col-md-4 orders-panel">
        <div class="order-wrappers-panel animated zoomIn">
            <CartHeader/>
            <CartItem/>
        </div>
        <CartHoldOrder/>
        <CartFooter/>
    </div>
</template>

<script>
    import CartHeader from './cart/CartHeader'
    import CartItem from './cart/CartItem'
    import CartHoldOrder from './cart/CartHoldOrder'
    import CartFooter from './cart/CartFooter'

    export default {
        name: 'ContentCart',
        props: {
            msg: String
        },
        components: {
            CartHeader,
            CartItem,
            CartHoldOrder,
            CartFooter
        }
    }
</script>