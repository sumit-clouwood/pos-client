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
    import CartHeader from './content/cart/CartHeader'
    import CartItem from './content/cart/CartItem'
    import CartHoldOrder from './content/cart/CartHoldOrder'
    import CartFooter from './content/cart/CartFooter'

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