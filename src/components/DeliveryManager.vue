<template>

    <div>
        <!-- Breadcrumbs-->
        <SystemNavigation />

        <!--body content left-->
        <div class="content-wrapper" id="dm-content-wrapper">

            <div class="inner-content-dm">
                <div class="dm-btn-wrap">
                    <div class="left-btn-wrap">
                        <button class="active dm-btn" data-related="home-delivery-order">Home Delivery Orders</button>
                        <button class="dm-btn" data-related="take-away-order">Take Away Orders</button>
                        <button class="dm-btn" data-related="future-order">Future Orders</button>
                    </div>
                    <div class="right-btn-wrap">
                        <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">All Branches </button>
                        <ul class="dropdown-menu">
                            <li><a href="#">Test Branch</a></li>
                            <li><a href="#">Test Branch</a></li>
                            <li><a href="#">Test Branch</a></li>
                        </ul>
                    </div>
                </div>
                <div class="dm-order-screens dm-order-screen-change" id="home-delivery-order">
                    <div class="dm-order-details-wrap">
                        <div class="dm-delivery-details-btn">
                            <ul class="dm-ullist">
                                <li class="active" data-related="dm-new-order"><a href="#">New Orders</a><span>60</span></li>
                                <li class="pick" data-related="dm-waiting-for-pick"><a href="#">Waiting for Pick</a><span>12</span></li>
                                <li class="pick" data-related="dm-delivery-in-progress"><a href="#">Delivery - In Progress</a><span>12</span></li>
                                <li class="dm-delivered" data-related="dm-delivered"><a href="#">Delivered</a><span>12</span></li>
                            </ul>
                        </div>
                        <div class="dm-delivery-assistants">
                            <button id="dm-assistant" data-toggle="modal" data-target="#delivery-assistant"><span><img src="img/other/delivery-assistant.png" alt="delivery"></span> Delivery Assistant</button>
                        </div>
                    </div>

                    <div class="dm-ready-order-wrapper" id="dm-new-order">
                        <div class="ready-order-wraper-left">
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>AL NOAF 3</h4>
                                    <p>Box 2456, Street 7, Sharjah</p>
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>

                                    <button id="ready"><span data-toggle="modal" data-target="#delivery-manager">More details</span><a href="#">Ready</a></button>
                                </div>
                            </div>
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>AL NOAF 3</h4>
                                    <p>Box 2456, Street 7, Sharjah</p>
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>

                                    <button id="ready"><span data-toggle="modal" data-target="#delivery-manager">More details</span><a href="#">Ready</a></button>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="ready-order-wraper-right">

                        </div> -->
                    </div>
                    <div class="dm-ready-order-wrapper" id="dm-waiting-for-pick">
                        <div class="select-driver"><button type="button" class="btn dropdown-toggle" data-toggle="dropdown">Select Driver</button>
                            <ul class="dropdown-menu">
                                <li><a href="#">Test Branch</a></li>
                                <li><a href="#">Test Branch</a></li>
                                <li><a href="#">Test Branch</a></li>
                            </ul>
                            <!-- <p>Show Available Drivers</p> -->
                        </div>

                        <div class="ready-order-wraper-left">
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>AL NOAF 3</h4>
                                    <p>Box 2456, Street 7, Sharjah</p>
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>

                                    <p>UN-ASSIGNED</p>
                                </div>
                            </div>
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>AL NOAF 3</h4>
                                    <p>Box 2456, Street 7, Sharjah</p>
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>

                                    <p>UN-ASSIGNED</p>
                                </div>
                            </div>
                        </div>
                        <!--  <div class="ready-order-wraper-right">

                         </div> -->
                    </div>
                    <div class="dm-ready-order-wrapper" id="dm-delivery-in-progress">
                        <div class="ready-order-wraper-left">
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>AL NOAF 3</h4>
                                    <p>SHAUKAT TECOM DRIVERS</p>
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>

                                    <button id="ready"><span data-toggle="modal" data-target="#delivery-manager">More details</span><a href="#">DELIVERED?</a></button>
                                </div>
                            </div>
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>AL NOAF 3</h4>
                                    <p>SHAUKAT TECOM DRIVERS</p>
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>

                                    <button id="ready"><span data-toggle="modal" data-target="#delivery-manager">More details</span><a href="#">DELIVERED?</a></button>
                                </div>
                            </div>
                        </div>
                        <!--  <div class="ready-order-wraper-right">

                         </div> -->
                    </div>
                    <div class="dm-ready-order-wrapper" id="dm-delivered">
                        <div class="delivered-order-table">
                            <table class="table table-responsive">
                                <tbody>
                                <tr>
                                    <th style="width: 260px">DRIVER NAME</th>
                                    <th style="width: 150px">TOTAL DELIVERED</th>
                                    <th style="width: 190px">TOTAL AMOUNT</th>
                                    <th style="width: 255px">CASH AMOUNT</th>
                                    <th style="width: 190px">CREDIT AMOUNT</th>
                                    <th style="width: 190px">AVERAGE DELIVERY TIME </th>
                                    <th style="width: 250px"></th>
                                </tr>
                                <tr class="">
                                    <td>Iqbal University Sharjah</td>
                                    <td>11</td>
                                    <td>572.01</td>
                                    <td>444.51</td>
                                    <td>127.5</td>
                                    <td>00:00:07</td>

                                    <td class="show-details-his"><span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 20 13">
            <g fill="#27A83D" fill-rule="nonzero">
                <path d="M10 12.971c-2.229 0-4.621-1.053-6.921-3.063A19.21 19.21 0 0 1 .263 6.884a.526.526 0 0 1 0-.608A19.21 19.21 0 0 1 3.08 3.25C5.379 1.245 7.77.187 10 .187s4.621 1.052 6.921 3.063a19.21 19.21 0 0 1 2.816 3.024.526.526 0 0 1 0 .608 19.21 19.21 0 0 1-2.816 3.026c-2.3 2.005-4.692 3.063-6.921 3.063zM1.363 6.58c.924 1.174 4.492 5.34 8.637 5.34 4.145 0 7.716-4.164 8.637-5.34-.924-1.174-4.492-5.34-8.637-5.34-4.145 0-7.716 4.164-8.637 5.34z"></path>
                <path d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"></path>
            </g>
        </svg><span>Show Details</span></span> <small class="delivered-refresh-data"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" version="1.1" width="16px" height="16px">
                                        <g id="surface1">
                                            <path style=" " d="M 7.5 1.035156 C 3.917969 1.035156 1 3.941406 1 7.515625 L 1 8 L 2 8 L 2 7.515625 C 2 4.484375 4.457031 2.035156 7.5 2.035156 C 9.132813 2.035156 10.589844 2.75 11.59375 3.875 L 10.464844 5 L 14 5 L 14 1.476563 L 12.300781 3.167969 C 11.113281 1.863281 9.40625 1.035156 7.5 1.035156 Z M 13 7 L 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 5.859375 13 4.402344 12.277344 3.394531 11.140625 L 4.535156 10 L 1 10 L 1 13.535156 L 2.6875 11.847656 C 3.878906 13.164063 5.589844 14 7.5 14 C 11.085938 14 14 11.085938 14 7.5 L 14 7 Z "/>
                                        </g>
                                    </svg> <span>Refresh Data</span></small> <small class="delivered-hide"><span>Hide</span> <img src="images/hide.png"
                                                                                                                                  alt="hide"></small></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- <==================================================> -->
                <div class="dm-order-take-away dm-order-screen-change" id="take-away-order">
                    <div class="dm-order-details-wrap">
                        <div class="dm-delivery-details-btn">
                            <ul class="dm-ullist">
                                <li class="active" data-related="Waiting-for-Collections"><a href="#">Waiting for Collections</a><span>10</span></li>
                                <li class="pick" data-related="collected"><a href="#">Collected</a><span>66</span></li>

                            </ul>
                        </div>
                        <div class="dm-delivery-assistants">
                            <p style="height: 34px;"></p>
                        </div>
                    </div>

                    <div class="dm-ready-order-wrapper" id="Waiting-for-Collections">
                        <div class="ready-order-wraper-left">
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>King Faisal Sharjah</h4>
                                    <!-- <p>Box 2456, Street 7, Sharjah</p> -->
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>

                                    <button id="ready"><span data-toggle="modal" data-target="#delivery-manager">More details</span><a href="#">Collected</a></button>
                                </div>
                            </div>
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>King Faisal Sharjah</h4>
                                    <!-- <p>Box 2456, Street 7, Sharjah</p> -->
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>

                                    <button id="ready"><span data-toggle="modal" data-target="#delivery-manager">More details</span><a href="#">Collected</a></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dm-ready-order-wrapper" id="collected">
                        <div class="ready-order-wraper-left">
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>King Faisal Sharjah</h4>
                                    <!-- <p>Box 2456, Street 7, Sharjah</p> -->
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>

                                    <button id="ready"><span data-toggle="modal" data-target="#delivery-manager">More details</span><a href="#">Delivered</a></button>
                                </div>
                            </div>
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>King Faisal Sharjah</h4>
                                    <!-- <p>Box 2456, Street 7, Sharjah</p> -->
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>

                                    <button id="ready"><span data-toggle="modal" data-target="#delivery-manager">More details</span><a href="#">Delivered</a></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ============================================================= Future Order -->

                <div class="dm-future-order dm-order-screen-change" id="future-order">

                    <div class="dm-ready-order-wrapper-future">
                        <div class="ready-order-wraper-left">
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>AL NOAF 3</h4>
                                    <p>Box 2456, Street 7, Sharjah</p>
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>
                                    <p>FARAH NUMAN/ 0567868708</p>
                                </div>
                            </div>
                            <div class="dm-contain-order">
                                <div class="dm-deliver-detail">
                                    <h4>2231341</h4>
                                    <p>Meat Ball Pasta Combo</p>
                                    <h4>AL NOAF 3</h4>
                                    <p>Box 2456, Street 7, Sharjah</p>
                                </div>
                                <div class="dm-deliver-detail-right">
                                    <p class="dm-amt">40.00 AED</p>
                                    <p class="dm-time">03:41 PM</p>
                                    <p>OMAR AL FALASI/ 0527301027</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ============================================= -->
                <!-- Delivery for pick -->

            </div>

        </div>


        <!-- Delivery Manager screen -->
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
        <!-- End Delivery maanger screen -->

        <!-- Delivery Assistant popup -->
        <div class="modal fade" id="delivery-assistant" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header customer-header">
                        <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
                        <h4 class="customer-title">Delivery Assistant</h4>
                    </div>
                    <div class="modal-body add-email-wrap">
                        <div class="add-note-area">
                            <p>Did you know that Broccoli has a mobile interface for your delivery boys to help them manage deliveries?
                                Simply fire up <a href="#" class="da-link">http://app.broccoli.com/deliveryassistant</a> on a smartphone and give your delivery boys credentials to log in. They can mark parcels as delivered right at the customer's doorstep. This will help you track delivery times and other performance indicators to help you understand the efficiency of your delivery process. </p>
                            <div class="da-image">
                                <img src="images/mobile.png" alt="delivery-assistant">
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <div class="btn-announce">
                            <button type="button" class="btn btn-danger cancel-announce" data-dismiss="modal"><span>✕</span> Cancel</button>
                        </div>
                        <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
                    </div>
                </div>

            </div>
        </div>
        <!-- End Delivery Assitant popup -->

        <!-- menu popup -->
        <div class="modal fade" id="bar-sign" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">✕</button>
                    </div>
                    <div class="modal-body">

                        <div class="left-btn-wrap">
                            <button data-dismiss="modal" class="active dm-btn" data-related="home-delivery-order">Home Delivery Orders</button>
                            <button data-dismiss="modal" class="dm-btn" data-related="take-away-order">Take Away Orders</button>
                            <button data-dismiss="modal" class="dm-btn" data-related="future-order">Future Orders</button>
                        </div>



                    </div>
                    <div class="modal-footer">
                        <!--   <div class="btn-announce">
                            <button type="button" class="btn btn-danger cancel-announce" data-dismiss="modal"><span></span> Cancel</button>
                          </div> -->

                    </div>
                </div>

            </div>
        </div>
        <!-- End Menu popup -->


        <!--&lt;!&ndash; Bootstrap core JavaScript&ndash;&gt;
        <script src="/js/jquery.js" type="text/javascript"></script>
        <script src="/js/bootstrap.bundle.js" type="text/javascript"></script>

        &lt;!&ndash; Core plugin JavaScript&ndash;&gt;
        &lt;!&ndash;<script src="vendor/jquery-easing/jquery.easing.min.js"></script>&ndash;&gt;
        &lt;!&ndash; Custom scripts for all pages&ndash;&gt;
        <script type="text/javascript" src="js/datepicker.min.js"></script>
        <script type="text/javascript" src="js/datepicker.en.js"></script>
        <script src="/js/pos_script.js" type="text/javascript"></script>
        &lt;!&ndash; <script src="js/owl.carousel.js"></script> &ndash;&gt;
        <script src="/js/slick.js" type="text/javascript"></script>-->

        <div class="modal-backdrop fade show" id="transparent-screen"></div>
    </div>
</template>

<script>
import SystemNavigation from '@/components/SystemNavigation'

export default {
  name: 'DeliveryManager',
  components: {
    SystemNavigation
  }
}
</script>