<template>
  <div class="wrappers-orders">
    <div class="orders-name">
        <p>Papperoni Pizza Small</p>
        <p class="price-qty">@ 21.90 x 2</p>
        <Modifiers />
    </div>
    <div class="aed-amt">
        <span>AED 42.90</span>
    </div>
    <div class="dlt-btn">
        <img src="img/pos/delete-icon.svg" alt="delete">
    </div>
    
  </div>
</template>

<script>
    import Modifiers from './items/Modifiers.vue'
    export default {
        name: 'Items',
        props: {},
        components : {
            Modifiers
        }
    }
</script>