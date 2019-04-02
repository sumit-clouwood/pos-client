<template>
  <!-- Add to order popup -->
  <div class="modal fade" id="add-to-order" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Add to Order</h4>
        </div>
        <div class="modal-body add-to-order">
          <CustomerDeliveryArea
            v-if="deliveryAddresses.length"
            :addresses="deliveryAddresses"
            :buttons="false"
          />
          <div class="loading" v-else>Loading ...</div>
        </div>
        <div class="modal-footer" v-show="deliveryAddresses.length">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
              id="cancel-annc"
            >
              <span>X</span> Close
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save"
              type="button"
              id="add-customer-btn"
              @click="updateModalSelectionDelivery('#order-confirmation')"
              data-dismiss="modal"
            >
              Add
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Add to order popup -->
</template>

<script>
import { mapState, mapActions } from 'vuex'

import CustomerDeliveryArea from '../CustomerAddress/CustomerDeliveryArea'
export default {
  name: 'SelectCustomerAddress',
  components: {
    CustomerDeliveryArea,
  },

  computed: {
    ...mapState({
      deliveryAddresses: state =>
        state.customer.fetchCustomerAddressOnly.customer_list
          ? state.customer.fetchCustomerAddressOnly.customer_list[0]
            .customer_details
          : [],
    }),
  },
  methods: {
    ...mapActions('location', ['updateModalSelectionDelivery']),
  },
}
</script>
<style scoped>
.loading {
  padding: 30px;
}
</style>
