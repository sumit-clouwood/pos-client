<template>
    <div class="modal fade" id="business-summary" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content color-dashboard-background">
                <div class="modal-header customer-header color-secondary">
                    <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
                    <h4 class="customer-title color-text-invert">
                        Business Summary Details
                        {{ _t('Business Summary Details') }}
                    </h4>
                </div>
                <div class="modal-body row business-summary">
                    <div class="business-summary-wrapper">
                        <div class="table-responsive">
                            <table>
                                <thead>
                            <tr>
                                <th>{{ _t('Sales') }} <span><i class="fa fa-sort" aria-hidden="true"></i></span></th>
                                <th>{{ _t('Value') }} <span><i class="fa fa-sort" aria-hidden="true"></i></span></th>
                            </tr>
                                </thead>
                                <tbody>
                            <tr>
                                <td>Gross Sales</td>
                                <td class="align-right">4333 NZD</td>
                            </tr>
                                <tr>
                                    <td>Gross Sales</td>
                                    <td class="align-right">4333 NZD</td>
                                </tr>
                                <tr>
                                    <td>Gross Sales</td>
                                    <td class="align-right">4333 NZD</td>
                                </tr>
                                <tr>
                                    <td>Gross Sales</td>
                                    <td class="align-right">4333 NZD</td>
                                </tr>
                                <tr>
                                    <td>Gross Sales</td>
                                    <td class="align-right">4333 NZD</td>
                                </tr>
                                <tr>
                                    <td>Gross Sales</td>
                                    <td class="align-right">4333 NZD</td>
                                </tr>
                                </tbody>
                        </table>
                        </div>
                        <div class="table-responsive">
                            <table>
                                <thead>
                            <tr>
                                <th>{{ _t('Orders') }} <span><i class="fa fa-sort" aria-hidden="true"></i></span></th>
                                <th>{{ _t('Oty') }} <span><i class="fa fa-sort" aria-hidden="true"></i></span></th>
                            </tr>
                                </thead>
                                <tbody>
                            <tr>
                                <td>Total Orders</td>
                                <td class="align-right">3</td>
                            </tr>
                                <tr>
                                    <td>Total Orders</td>
                                    <td class="align-right">3</td>
                                </tr>
                                <tr>
                                    <td>Total Orders</td>
                                    <td class="align-right">3</td>
                                </tr>
                                <tr>
                                    <td>Total Orders</td>
                                    <td class="align-right">3</td>
                                </tr>
                                <tr>
                                    <td>Total Orders</td>
                                    <td class="align-right">3</td>
                                </tr>
                                <tr>
                                    <td>Total Orders</td>
                                    <td class="align-right">3</td>
                                </tr>
                                </tbody>
                        </table>
                        </div>
                        <div class="table-responsive">
                            <table>
                                <thead>
                            <tr>
                                <th>{{ _t('Payment Types') }} <span><i class="fa fa-sort" aria-hidden="true"></i></span></th>
                                <th>{{ _t('Qty') }} <span><i class="fa fa-sort" aria-hidden="true"></i></span></th>
                                <th>{{ _t('Value') }} <span><i class="fa fa-sort" aria-hidden="true"></i></span></th>
                            </tr>
                                </thead>
                                <tbody>
                            <tr>
                                <td>Cash</td>
                                <td class="align-right">3</td>
                                <td class="align-right">162.89 NZD</td>
                            </tr>
                                <tr>
                                    <td>Cash</td>
                                    <td class="align-right">3</td>
                                    <td class="align-right">162.89 NZD</td>
                                </tr>
                                <tr>
                                    <td>Cash</td>
                                    <td class="align-right">3</td>
                                    <td class="align-right">162.89 NZD</td>
                                </tr>
                                <tr>
                                    <td>Cash</td>
                                    <td class="align-right">3</td>
                                    <td class="align-right">162.89 NZD</td>
                                </tr>
                                <tr>
                                    <td>Cash</td>
                                    <td class="align-right">3</td>
                                    <td class="align-right">162.89 NZD</td>
                                </tr>
                                <tr>
                                    <td>Cash</td>
                                    <td class="align-right">3</td>
                                    <td class="align-right">162.89 NZD</td>
                                </tr>
                                </tbody>
                        </table>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="btn-announce">
                        <button
                                class="btn btn-success btn-large color-main color-text-invert"
                                type="button"
                                data-dismiss="modal"
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- End Select Discount -->
</template>
<script>
    export default {
        name: 'BusinessSummary',
        data() {
            return {}
        },
    }
</script>
