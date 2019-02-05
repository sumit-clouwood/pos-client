<template>
    <div>
        <div class="col-md-8 left-container">
            <search/>
            <div class="row">
                <SubMenu/>
                <Products/>
            </div>
        </div>
        <div class="col-md-4 orders-panel">
            <div class="order-wrappers-panel animated zoomIn">
                <CartHeader/>
                <CartItem/>
            </div>
        </div>
    </div>
</template>

<script>
    import Products from './content/Products'
    import Search from './content/Search'
    import SubMenu from './content/SubMenu'
    import CartHeader from './content/cart/CartHeader'
    import CartItem from './content/cart/CartItem'

    export default {
        name: 'Content',
        props: {
            msg: String
        },
        components: {
            Products,
            Search,
            SubMenu,
            CartHeader,
            CartItem
        }
    }
</script>