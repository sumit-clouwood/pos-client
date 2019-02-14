<template>
    <div class="wrappers-order-block">
        <Header />
        <Items />
    </div>
</template>

<script>
    import Header from './newOrders/Header.vue'
    import Items from './newOrders/Items.vue'
  
    export default {
        name: 'NewOrders',
        components : {
            Header,
            Items
        },
        props: {}
    }
</script>