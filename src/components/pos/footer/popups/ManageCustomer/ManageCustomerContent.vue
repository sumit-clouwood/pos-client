<template>
  <div class="manage-customer-table">
    <Preloader v-if="loading" />
    <div v-else>
      <div v-if="!customerDetails.length">No matching customer found.</div>
      <table class="table table-responsive" v-else>
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
                @click="fetchSelectedCustomer({ customerId: customer._id })"
                class="br-table-btn display-order"
              >
                Display Order
              </button>
            </td>
            <td>
              <button
                @click="fetchSelectedCustomer({ customerId: customer._id })"
                data-toggle="modal"
                data-target="#display-order"
                data-dismiss="modal"
                class="br-table-btn edit-info"
              >
                Edit Info</button
              ><button
                @click="
                  fetchSelectedCustomer({
                    customerId: customer._id,
                    addressOnly: true,
                  })
                "
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Preloader from '@/components/util/Preloader'
export default {
  name: 'ManageCustomerContent',
  props: [''],
  components: {
    Preloader,
  },
  computed: {
    ...mapState({
      customerDetails: state => state.customer.customer_list,
    }),
    ...mapState('customer', ['loading']),
  },
  data: function() {
    return { activeIndex: '' }
  },

  methods: {
    setActiveCustomer(index) {
      this.activeIndex = index
    },
    // updateDada() {
    //   $('.last-order-wrap')[0].slick.refresh()
    //   // this.props.customerId = customerId
    // },

    ...mapActions('customer', ['fetchSelectedCustomer']),
  },
}
</script>
