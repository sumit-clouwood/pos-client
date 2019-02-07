<template>
    <!-- Manage Customers -->
    <div class="modal fade" id="manage-customer" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header customer-header">
                    <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
                    <h4 class="customer-title">Manage Customers</h4>
                </div>
                <div class="modal-body manage-customer-wrap">
                    <div class="inner-addon left-addon">
                        <img class="search-img" src="img/pos/search-icon.png" alt="search">
                        <input type="text" class="form-control" placeholder="Search customer">
                    </div>
                    <div class="manage-customer-table">
                        <table class="table table-responsive">
                            <tr>
                                <th style="width: 190px">Customer Name  </th>
                                <th style="width: 140px">Phone# </th>
                                <th style="width: 190px">Email</th>
                                <th style="width: 155px">Ref. Code  </th>
                                <th style="width: 250px">City, Location</th>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>
                            <tr class="referal-code-customer">
                                <td>Beby Jovanca</td>
                                <td>0812921312</td>
                                <td>beby@gmail.com</td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn display-order">Display Order</button></td>
                                <td><button data-toggle="modal" data-target="#display-order" data-dismiss="modal" class="br-table-btn edit-info">Edit Info</button><button data-toggle="modal" data-target="#add-to-order" data-dismiss="modal" class="br-table-btn order-add">Add to Order</button><span>Abu Dhabi</span></td>
                            </tr>

                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="pagination-customer-details">
                        <ul class="ullist-pagination">
                            <li class="next-page" id="previous-page"><img src="img/pos/back-arrow.png" alt="next-btn"></li>
                            <li>1</li>
                            <li class="next-page" id="next-page"><img src="img/pos/next-arrow.png" alt="next-btn"></li>
                            <li>Last</li>
                        </ul>
                    </div>
                    <div class="btn-announce">

                        <button type="button" class="btn btn-danger cancel-announce" data-dismiss="modal"><span>X</span>Cancel</button>
                        <button class="btn btn-success btn-large popup-btn-save" type="button" id="cust-new" data-toggle="modal" data-target="#customer" data-dismiss="modal">New Customer
                        </button>
                    </div>
                    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
                </div>
            </div>

        </div>
    </div>
    <!-- End Manage Customers -->
</template>

<script>
    export default {
        name: 'ManageCustomer',
        props:{}
    }
</script>