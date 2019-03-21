<template>
  <!-- Manage Customers -->
  <div>
    <div class="modal fade offline" id="manage-customer" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header customer-header">
            <h4 class="customer-title">Create new customer offline</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>
          <CustomerForm ref="form" />
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
                v-on:click="post"
              >
                Save
              </button>
            </div>
            <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
          </div>
        </div>
      </div>
    </div>
    <InformationPopup
      :responseInformation="{ status: status, message: message }"
      :title="title"
    />
  </div>
  <!-- End Manage Customers -->
</template>

<script>
/* global $ */
/* eslint-disable no-console */
import InformationPopup from '@/components/pos/content/InformationPopup'
import CustomerForm from './ManageCustomer/CustomerForm'
export default {
  name: 'ManageCustomer',
  props: {},
  data: function() {
    return {
      title: 'Customer Success',
      status: 0,
      message: '',
    }
  },
  components: { InformationPopup, CustomerForm },
  methods: {
    post() {
      const errors = this.$refs.form.validate()
      if (errors.count === 0) {
        const data = this.$refs.form.getData()
        this.$store.dispatch('customer/setOfflineData', data)
        this.status = 1
        this.message = 'Data saved for offline order'

        $('#manage-customer').modal('hide')
        $('#information-popup').modal('show')
      }
    },
  },
}
</script>
<style scoped>
.modal-dialog {
  width: 1180px !important;
  max-width: 1180px !important;
}
</style>
