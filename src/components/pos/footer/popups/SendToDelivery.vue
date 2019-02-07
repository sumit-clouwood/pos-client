<template>
    <!-- order confrmation  -->
    <div class="modal fade" id="order-confirmation" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="order-header">
                    <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
                    <h4 class="order-confirm-title">Order Confirmation</h4>
                    <p>Please confirm the order below to delivered :</p>
                </div>
                <div class="modal-body order-confirmation-wrap">
                    <div class="order-table">
                        <table class="table table-responsive">
                            <tr>
                                <th style="width: 300px">ITEM NAME</th>
                                <th style="width: 100px">QTY</th>
                                <th style="width: 150px">PRICE</th>
                                <th style="width: 100px">TAX</th>
                                <th style="width: 150px">SUBTOTAL</th>
                            </tr>
                            <tr>
                                <td>Vegetable Pizza Small</td>
                                <td>2</td>
                                <td>21.00</td>
                                <td>0.00</td>
                                <td>21.00</td>
                            </tr>
                            <tr class="pay-tot-amt">
                                <td>Pepsi</td>
                                <td>2</td>
                                <td>21.00</td>
                                <td>0.00</td>
                                <td>21.00</td>
                            </tr>
                            <tr>
                                <td>Vegetable Pizza Small</td>
                                <td>2</td>
                                <td>21.00</td>
                                <td>0.00</td>
                                <td>21.00</td>
                            </tr>
                            <tr class="pay-tot-amt">
                                <td>Pepsi</td>
                                <td>2</td>
                                <td>21.00</td>
                                <td>0.00</td>
                                <td>21.00</td>
                            </tr>
                            <tr>
                                <td>Vegetable Pizza Small</td>
                                <td>2</td>
                                <td>21.00</td>
                                <td>0.00</td>
                                <td>21.00</td>
                            </tr>
                            <tr class="pay-tot-amt">
                                <td>Pepsi</td>
                                <td>2</td>
                                <td>21.00</td>
                                <td>0.00</td>
                                <td>21.00</td>
                            </tr>

                        </table>
                    </div>
                    <div id="total-order-wrap" class="total-order">
                        <div class="order-notes">
                            <p class="notes-title">NOTES</p>
                            <p>Lorem Ipsum is simply dummy text
                                of the printing and typesetting
                                industry porto.</p>
                        </div>
                        <div class="order-confirm-amt" id="total-confirm-order">
                            <div class="order-amt-title">
                                <p>SUBTOTAL :</p>
                                <p>SURCHARGE :</p>
                                <p>ORDER DISCOUNT :</p>
                                <p>TAX :</p>
                                <p>BILL AMOUNT :</p>
                            </div>
                            <div class="order-amt-charges">
                                <p>INR 42.00</p>
                                <p>INR 0.00</p>
                                <p>INR 0.00</p>
                                <p>INR 0.00</p>
                                <p>INR 42.00</p>
                            </div>
                        </div>
                    </div>
                    <!--<div class="cash-referal">-->
                    <!--<label class="container-checkbox">Cash On Delivery-->
                    <!--<input type="checkbox" checked>-->
                    <!--<span class="checkmark"></span>-->
                    <!--</label>-->
                    <!--</div>-->
                </div>
                <div class="modal-footer">
                    <div class="referal">
                        <button type="button" data-value="" id="referal-btn" class="btn referal-btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Referal</button><!--<span><img src="images/referal-down.png"></span>-->
                        <div class="dropdown-menu">
                            <a class="dropdown-item" data-value="Call Center" href="#">Call Center</a>
                            <a class="dropdown-item" data-value="Talabat" href="#">Talabat</a>
                            <a class="dropdown-item" data-value="Talabat Credit" href="#">Talabat Credit</a>
                            <a class="dropdown-item" data-value="Zomato" href="#">Zomato</a>
                            <a class="dropdown-item" data-value="Zomato Credit" href="#">Zomato Credit</a>
                            <a class="dropdown-item" data-value="Round Menu" href="#">Round Menu</a>

                        </div>
                        <button  data-range="true" data-multiple-dates-separator=" - " class="btn btn-success btn-large datepicker-here" type="button" id="schedule-btn" data-timepicker="true" data-language='en'>Schedule <span><img src="img/pos/schedule-icon.png" alt="schedule"></span></button>
                    </div>
                    <div class="btn-announce">
                        <button type="button" class="btn btn-danger cancel-announce" data-dismiss="modal"><span>X</span> Close</button>
                        <button class="btn btn-success btn-large" type="button" id="confirm_announcement">Confirm</button>
                    </div>
                    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
                </div>
            </div>

        </div>
    </div>
    <!-- End Order confirmation  -->
</template>


<script>
    export default {
        name: 'SendToDelivery',
        props: {}
    }
</script>