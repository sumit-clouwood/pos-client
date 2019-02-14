<template>
    <div class="total-amount-wrapper">
        <div class="surcharge-amt">
            <div><span class="total-charges">Sub Total</span> <span class="aed-charges">AED 131.40</span></div>
            <div><span class="total-charges">Surcharges</span> <span class="aed-charges">AED 36.28</span></div>
            <div><span class="total-charges">Discounts</span> <span class="aed-charges">AED 0.00</span></div>
            <div><span class="total-charges">Tax</span> <span class="aed-charges">AED 1.81</span></div>

        </div>

        <div class="total-amount">
            <div><span class="total-charges">Total</span><span class="aed-charges">AED 161.49</span></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CartFooter',
        props: {}
    }
</script>