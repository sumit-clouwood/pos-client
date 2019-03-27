<template>
  <div>
    <div class="wrappers-new-orders">
      <div class="order">
        <h5>New Orders</h5>
        <p>
          {{ todayDateFull }}
        </p>
      </div>
      <div class="account-name" v-if="selectedCustomer">
        <p v-if="selectedCustomer.email != ''">
          Email : {{ selectedCustomer.email }}
        </p>
        <p
          v-if="
            selectedCustomer.customer_name != '' && selectedCustomer.email == ''
          "
        >
          Name : {{ selectedCustomer.customer_name }}
        </p>
        <p v-if="selectedCustomer.mobile_number">
          Phone : {{ selectedCustomer.mobile_number }}
        </p>
      </div>
    </div>
    <div class="table-pos-btn">
      <button type="" class="popup-btn-save">Move Table</button>
      <button type="" class="popup-btn-save">Split Table</button>
      <button type="" class="popup-btn-save">Hold</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Header',
  props: {},
  computed: {
    ...mapGetters('sync', ['todayDateFull']),
    ...mapState({
      selectedCustomer: state =>
        typeof state.customer.customer.customer_list != 'undefined'
          ? state.customer.customer.customer_list
          : typeof state.customer.fetchCustomerAddressOnly.customer_list !=
            'undefined'
            ? state.customer.fetchCustomerAddressOnly.customer_list[0]
            : false,
    }),
  },
}
</script>
