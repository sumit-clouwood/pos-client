<template>
    <div>
        <footer class="sticky-footer">
            <div class="container">
                <ul class="ullist-icons">
                    <li data-toggle="modal" data-target="#manage-customer">
                        <a href="#"><img src="img/pos/customer.svg" alt="customer"><span>Customer</span></a>
                    </li>
                    <li id="hold-order-box">
                        <!-- <a href="#"><img class="hold-orders-show" src="images/footer-images/s.png" alt="customer"><img class="hold-order" src="images/hold-order.png" alt="customer"><span>Hold Orders</span></a>-->
                        <a href="#"><img class="hold-orders-show" src="img/pos/hold.svg"><img class="hold-order"
                                                                                              src="img/pos/hold-order.svg"><span>Hold Orders</span></a>
                    </li>
                    <li data-toggle="modal" data-target="#order-confirmation" data-dismiss="modal">
                        <a href="#"><img src="img/pos/delivery.svg"><span>Send to Delivery</span></a>
                    </li>
                    <li class="active" data-toggle="modal" data-target="#select-discount" id="discount-footer">
                        <a href="#"><img src="img/pos/discount.svg"><span>Select Discount</span></a>
                    </li>
                    <li data-toggle="modal" data-target="#dining-option">
                        <a href="#"><img src="img/pos/dining.svg"><span>Dinning Options</span></a>
                    </li>
                    <li data-toggle="modal" data-target="#add-note">
                        <a href="#"><img src="img/pos/notes.svg" alt="note"><span>Add Note</span></a>
                    </li>
                </ul>
                <ul class="template-btn">
                    <li class="pay-now"><a href="#"><img src="img/pos/payment.svg" alt="payment"><span class="pay-btn">Pay Now</span></a>
                    </li>
                </ul>
            </div>
        </footer>
    </div>
</template>

<script>
    export default {
        name: 'Footer',
        props: {},
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    /*@import "../../assets/sass/global";*/
    @import "../../assets/sass/footer";
</style>