<template>
    <div class="wrappers-order-block">
        <div class="wrappers-orders">
            <div class="orders-name">
                <p>Papperoni Pizza Small</p>
                <p class="price-qty">@ 21.90 x 2</p>
                <a href="">Bolognese Sauce</a><a href="">Chunky Tomato</a><span data-toggle="modal" data-target="#POSItemOptions"><img src="images/plus-icon.png" alt="plus"></span>
            </div>
            <div class="aed-amt">
                <span>AED 42.90</span>
            </div>
            <div class="dlt-btn">
                <img src="images/delete-icon.png" alt="delete">
            </div>
        </div>

        <div class="wrappers-orders">
            <div class="orders-name">
                <p>Papperoni Pizza Small</p>
                <p class="price-qty">@ 21.90 x 2</p>
                <span data-toggle="modal" data-target="#POSItemOptions"><img src="images/plus-icon.png" alt="plus"></span>
            </div>
            <div class="aed-amt">
                <span>AED 42.90</span>
            </div>
            <div class="dlt-btn">
                <img src="images/delete-icon.png" alt="delete">
            </div>
        </div>

        <div class="wrappers-orders">
            <div class="orders-name">
                <p>Pepsi Can</p>
                <p class="price-qty">@ 6 x 1</p>
                <span data-toggle="modal" data-target="#POSItemOptions"><img src="images/plus-icon.png" alt="plus"></span>
            </div>
            <div class="aed-amt">
                <span>AED 42.90</span>
            </div>
            <div class="dlt-btn">
                <img src="images/delete-icon.png" alt="delete">
            </div>
        </div>

        <div class="wrappers-orders">
            <div class="orders-name">
                <p>Orange Juice</p>
                <p class="price-qty">@ 6 x 1</p>
                <span data-toggle="modal" data-target="#POSItemOptions"><img src="images/plus-icon.png" alt="plus"></span>
            </div>
            <div class="aed-amt">
                <span>AED 42.90</span>
            </div>
            <div class="dlt-btn">
                <img src="images/delete-icon.png" alt="delete">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CartItem',
        props: {}
    }
</script>