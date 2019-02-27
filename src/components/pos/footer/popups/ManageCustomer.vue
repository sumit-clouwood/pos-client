<template>
  <!-- Manage Customers -->
  <div class="modal fade" id="manage-customer" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Manage Customers</h4>
        </div>
        <div class="modal-body manage-customer-wrap">
          <ManageCustomerHeader />
          <ManageCustomerContent />
        </div>
        <ManageCustomerFooter />
      </div>
    </div>
  </div>
  <!-- End Manage Customers -->
</template>

<script>
import ManageCustomerHeader from './ManageCustomer/ManageCustomerHeader'
import ManageCustomerContent from './ManageCustomer/ManageCustomerContent'
import ManageCustomerFooter from './ManageCustomer/ManageCustomerFooter'
export default {
  name: 'ManageCustomer',
  props: {},
  components: {
    ManageCustomerHeader,
    ManageCustomerContent,
    ManageCustomerFooter,
  },
}
</script>
