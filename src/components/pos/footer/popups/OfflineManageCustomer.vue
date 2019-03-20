<template>
  <!-- Manage Customers -->
  <div class="modal fade offline" id="manage-customer" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Offline Manage Customers</h4>
        </div>
        <div class="modal-body manage-customer-wrap">
          <CustomerForm />
          <div class="modal-footer">
            <div class="btn-announce">
              <button
                type="button"
                class="btn btn-danger cancel-announce"
                data-dismiss="modal"
                id="close-customer"
              >
                <span>X</span> Cancel
              </button>
              <button
                class="btn btn-success btn-large"
                type="button"
                id="post_announcement"
                v-on:click="checkForm"
              >
                Save
              </button>
            </div>
            <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Manage Customers -->
</template>

<script>
export default {
  name: 'ManageCustomer',
  props: {},
  components: {},
}
</script>
