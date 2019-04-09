<template>
    <div class="modal fade" id="delivery-manager" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->

            <div class="modal-content">

                <div class="modal-body dm-confirmation-wrap dm-con">
                    <div class="dm-ready-order-wrap">
                        <div class="dm-ready-order-left">
                            <div class="dm-ready">
                                <p>Customer Name: </p>
                                <h5>Beby Jovanca</h5>
                            </div>
                            <div class="dm-ready">
                                <p>Phone Number:</p>
                                <h5>0504569912</h5>
                            </div>
                            <div class="dm-ready">
                                <p>Location/Branch: </p>
                                <h5>Muroor Road - Abu Dhabi</h5>
                            </div>
                            <div class="dm-ready">
                                <p>Staff: </p>
                                <h5>Beby Jovanca</h5>
                            </div>
                        </div>
                        <div class="dm-ready-order-right">
                            <div class="dm-ready">
                                <p>Order Number:</p>
                                <h5>2224466</h5>
                            </div>
                            <div class="dm-ready">
                                <p>Delivery Area: </p>
                                <h5>Al Muroor</h5>
                            </div>
                            <div class="dm-ready">
                                <p>Delivery Address:</p>
                                <h5>Al Muroor Road, Abu Dhabi</h5>
                            </div>
                        </div>
                        <div id="dm-payment-type-order">
                            <p class="payments-title">Payments :</p>
                            <div class="order-table">

                                <table class="table table-responsive">
                                    <tr>
                                        <th style="width: 500px">Paid By</th>
                                        <th style="width: 150px">Amount</th>
                                        <th style="width: 150px">Collected</th>
                                        <th style="width: 150px">Returned</th>
                                    </tr>
                                    <tr class="pay-tot-amt">
                                        <td>Cash</td>
                                        <td>100</td>
                                        <td>100</td>
                                        <td>0.00</td>
                                    </tr>
                                    <tr class="pay-tot-amt">
                                        <td>Mastercard</td>
                                        <td>100</td>
                                        <td>100</td>
                                        <td>0.00</td>
                                    </tr>
                                    <tr>
                                        <td>Credit Card</td>
                                        <td>200</td>
                                        <td>21.00</td>
                                        <td>0.00</td>
                                    </tr>
                                    <tr class="pay-tot-amt">
                                        <td>Paypal</td>
                                        <td>200</td>
                                        <td>21.00</td>
                                        <td>0.00</td>
                                    </tr>

                                </table>
                            </div>
                        </div>

                    </div>


                    <div class="dm-order-confirmation" id="dm-order-confirmation">
                        <div class="order-table">
                            <table class="table table-responsive">
                                <tr>
                                    <th style="width: 500px">ITEM NAME</th>
                                    <th style="width: 105px">Quantity</th>
                                    <th style="width: 150px">PRICE</th>
                                    <th style="width: 200px">SUB-PRICE</th>
                                </tr>
                                <tr class="pay-tot-amt">
                                    <td>Deluxe Pizza Medium </td>
                                    <td>1</td>
                                    <td>0</td>
                                    <td>0.00</td>
                                </tr>
                                <tr class="pay-tot-amt modifier-item-item">
                                    <td colspan="4"><a class="modifier-dm" href="#">Bolognese Sauce</a> <a class="modifier-dm" href="#">Bolognese Sauce</a> <a class="modifier-dm" href="#">Bolognese Sauce</a></td>
                                </tr>
                                <tr class="pay-tot-amt">
                                    <td>Beef Strips Pasta Plate </td>
                                    <td>1</td>
                                    <td>27.14</td>
                                    <td>27.14</td>
                                </tr>
                                <tr class="pay-tot-amt modifier-item-item">
                                    <td colspan="4"><a class="modifier-dm" href="#">Bolognese Sauce</a> <a class="modifier-dm" href="#">Bolognese Sauce</a></td></tr>
                                <tr>
                                    <td>Vegetable Pizza Small</td>
                                    <td>2</td>
                                    <td>21.00</td>
                                    <td>0.00</td>
                                </tr>
                                <tr class="pay-tot-amt">
                                    <td>Pepsi</td>
                                    <td>2</td>
                                    <td>21.00</td>
                                    <td>0.00</td>
                                </tr>

                            </table>
                        </div>
                        <div id="dm-order-past-wrap" class="total-order">
                            <div class="order-confirm-amt" id="dm-confirm-order-tab">
                                <div class="order-amt-title">
                                    <p>SUBTOTAL</p>
                                    <p>Delivery fee (AED 2.86)</p>
                                </div>
                                <div class="order-amt-charges">
                                    <p>INR 42.00</p>
                                    <p>INR 2.86</p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- DM popup history -->


                    <div class="dm-order-confirmation" id="dm-order-history-rec">
                        <h3 class="order-history-dm">Order History</h3>
                        <div class="order-table">

                            <table class="table table-responsive">
                                <tr>
                                    <th style="width: 150px">STATUS</th>
                                    <th style="width: 200px">STAFF</th>
                                    <th style="width: 500px">TIME</th>
                                </tr>
                                <tr class="pay-tot-amt">
                                    <td>New  </td>
                                    <td>Tecom</td>
                                    <td>May, 31 2018 14.00 PM</td>
                                </tr>
                                <tr class="pay-tot-amt">
                                    <td>New  </td>
                                    <td>Tecom</td>
                                    <td>May, 31 2018 14.00 PM</td>
                                </tr>
                                <tr class="pay-tot-amt">
                                    <td>New  </td>
                                    <td>Tecom</td>
                                    <td>May, 31 2018 14.00 PM</td>
                                </tr>
                                <tr class="pay-tot-amt">
                                    <td>New  </td>
                                    <td>Tecom</td>
                                    <td>May, 31 2018 14.00 PM</td>
                                </tr>

                            </table>
                        </div>

                    </div>
                    <!-- End Dm popup histry -->


                </div>


                <div class="modal-footer">
                    <div class="referal print-btn">
                        <button type="button" data-value="" id="referal-btn" class="btn referal-btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Re-Print</button><!--<span><img src="images/referal-down.png"></span>-->
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#">Delhi_invoice</a>
                            <a class="dropdown-item" href="#">ARB</a>
                            <a class="dropdown-item" href="#">Estonia</a>
                            <!--data-value="Estonia"-->
                            <!--data-value="ARB"-->
                            <!--data-value="Delhi_invoice"-->
                        </div>
                        <div class="referal">
                            <button type="button" class="btn view-history" id="view-past-order">View Past Orders</button>
                            <button class="btn btn-success btn-large" type="button" id="dm-modify-btn"><span><img src="img/other/edit-icon.png" alt="schedule"></span>Modify</button>
                        </div>
                    </div>
                    <div class="btn-announce">
                        <button type="button" class="btn" id="status-history"><span><img src="img/other/status.png" alt="status"></span>Status History</button>
                        <button type="button" class="btn" id="recipt-history"><span><img src="img/other/reciept.png" alt="status"></span>Show Receipt</button>
                        <button type="button" class="btn btn-danger cancel-announce" data-dismiss="modal"><span>✕</span> Close</button>
                    </div>
                    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
  name: 'DMOrderDetails',
}
</script>

<style scoped>

</style>