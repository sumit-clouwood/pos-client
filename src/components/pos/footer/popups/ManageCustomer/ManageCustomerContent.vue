<template>
  <div class="manage-customer-table">
    <table class="table table-responsive">
      <tr>
        <th style="width: 190px">Customer Name</th>
        <th style="width: 140px">Phone#</th>
        <th style="width: 190px">Email</th>
        <th style="width: 155px">Ref. Code</th>
        <th style="width: 250px">City, Location</th>
      </tr>

      <tr class="referal-code-customer" v-for="customer in customerDetails">
        <td>{{ customer.customer_name }}</td>
        <td>{{ customer.mobile_number }}</td>
        <td>{{ customer.email }}</td>
        <td>
          <button
            data-toggle="modal"
            data-target="#display-order"
            data-dismiss="modal"
            class="br-table-btn display-order"
          >
            Display Order
          </button>
        </td>
        <td>
          <button
            data-toggle="modal"
            data-target="#display-order"
            data-dismiss="modal"
            class="br-table-btn edit-info"
          >
            Edit Info</button
          ><button
            data-toggle="modal"
            data-target="#add-to-order"
            data-dismiss="modal"
            class="br-table-btn order-add"
          >
            Add to Order</button
          ><span>{{ customer.city }}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ManageCustomerContent',
  props: {},
  computed: {
    ...mapState({
      customerDetails: state => state.customer.customersDetail
    })
  },
}
</script>
