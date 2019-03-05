<template>
  <div class="manage-customer-table">
    <table class="table table-responsive">
      <thead>
        <tr>
          <th style="width: 190px">Customer Name</th>
          <th style="width: 140px">Phone#</th>
          <th style="width: 190px">Email</th>
          <th style="width: 155px">Ref. Code</th>
          <th style="width: 250px">City, Location</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="referal-code-customer"
          v-for="(customer, index) in customerDetails"
          v-bind:class="{ active: activeIndex === index }"
          v-on:click="setActiveCustomer(index)"
          :key="index"
        >
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
              @click="fetchSelectedCustomer(customer._id)"
              data-toggle="modal"
              data-target="#display-order"
              data-dismiss="modal"
              class="br-table-btn edit-info"
            >
              Edit Info</button
            ><button
              @click="fetchSelectedCustomer(customer._id)"
              data-toggle="modal"
              data-target="#add-to-order"
              data-dismiss="modal"
              class="br-table-btn order-add"
            >
              Add to Order</button
            ><span>{{ customer.city }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ManageCustomerContent',
  props: [''],
  computed: {
    ...mapState({
      customerDetails: state => state.customer.customer_list,
    }),
  },
  data: function() {
    return { activeIndex: '' }
  },

  methods: {
    setActiveCustomer(index) {
      this.activeIndex = index
    },
    // updateSlickSlider(customerId) {
    //   $('.last-order-wrap')[0].slick.refresh()
    //   this.props.customerId = customerId
    // },

    ...mapActions('customer', ['fetchSelectedCustomer']),
  },
}
</script>
