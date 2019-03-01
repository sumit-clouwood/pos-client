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
          <div class="add-to-order-wrapper">
            <div class="order-location option-contain active">
              <p>
                <span>Test Location</span>, 13 -BNearby Street, Delhi, India
              </p>
            </div>
            <div class="order-location option-contain">
              <p><span>Test Location</span>, Delhi, India</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
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
import { mapState } from 'vuex'
export default {
  name: 'SelectCustomerAddress',
  props: {},
  computed: {
    // ...mapState({
    //   selectedCustomerAddress: state.customer.customers
    // })
  },
}
</script>
