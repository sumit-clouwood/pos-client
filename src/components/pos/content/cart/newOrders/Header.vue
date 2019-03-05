<template>
  <div>
    <div class="wrappers-new-orders">
      <div class="order">
        <h5>New Orders</h5>
        <p>Tuesday, 13 Oct 2017</p>
      </div>
      <div class="account-name">
        <div v-if="selectedCustomer">
          <p v-if="selectedCustomer.email != ''">
            Email : {{ selectedCustomer.email }}
          </p>
          <p
            v-if="
              selectedCustomer.customer_name != '' &&
                selectedCustomer.email == ''
            "
          >
            Name : {{ selectedCustomer.customer_name }}
          </p>
          <p v-if="selectedCustomer.mobile_number">
            Phone : {{ selectedCustomer.mobile_number }}
          </p>
        </div>
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
import { mapState } from 'vuex'
export default {
  name: 'Header',
  props: {},
  computed: {
    ...mapState({
      selectedCustomer: state =>
        state.customer.customer.customer_list.length
          ? state.customer.customer.customer_list
          : false,
    }),
  },
}
</script>
