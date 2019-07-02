<template>
  <div class="manage-customer-table">
    <Preloader v-if="loading" />
    <div v-else>
      <div v-if="!customerDetails.length">
        {{ _t("No matching customer found") }}
      </div>
      <table class="table table-responsive" v-else>
        <thead>
          <tr>
            <th style="width: 190px">{{ _t("Customer Name") }}</th>
            <th style="width: 140px">{{ _t("Phone") }}#</th>
            <th style="width: 190px">{{ _t("Email") }}</th>
            <th style="width: 155px">{{ _t("Reference Code") }}</th>
            <th style="width: 250px">
              {{ _t("City") }}
              <!--, {{ _t('Location') }}-->
            </th>
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
            <td>{{ customer.name }}</td>
            <td>{{ customer.phone_number }}</td>
            <td>{{ customer.email }}</td>
            <td>
              <button
                data-toggle="modal"
                data-target="#display-order"
                data-dismiss="modal"
                @click="fetchSelectedCustomer(customer._id)"
                class="br-table-btn display-order"
              >
                {{ _t("Display Order") }}
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
                {{ _t("Edit Details") }}</button
              ><button
                @click="fetchSelectedCustomer(customer._id)"
                data-toggle="modal"
                data-target="#add-to-order"
                data-dismiss="modal"
                class="br-table-btn order-add"
              >
                {{ _t("Add to Order") }}</button
              ><span>{{
                getCustomerLocation(customer.customer_addresses)
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Preloader from "@/components/util/Preloader";
export default {
  name: "ManageCustomerContent",
  props: [""],
  components: {
    Preloader
  },
  computed: {
    ...mapState({
      customerDetails: state => state.customer.customer_list
    }),
    ...mapState("customer", ["loading"]),
    ...mapGetters("location", ["_t"])
  },
  data: function() {
    return { activeIndex: "" };
  },

  methods: {
    setActiveCustomer(index) {
      this.activeIndex = index;
    },
    getCustomerLocation(customerAddress) {
      if (customerAddress.length) {
        return customerAddress[0].city;
      }
    },
    // updateDada() {
    //   $('.last-order-wrap')[0].slick.refresh()
    //   // this.props.customerId = customerId
    // },

    ...mapActions("customer", ["fetchSelectedCustomer"])
  }
};
</script>
