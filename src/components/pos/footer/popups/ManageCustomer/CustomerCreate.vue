<template>
  <!-- Add customer model -->
  <div class="modal fade" id="customer" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <h4 class="customer-title">Create new customer</h4>
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
    <InformationPopup
      :responseInformation="customerCreateStatus"
      :title="customerCreateStatus.message"
    />
  </div>
  <!-- End customer Model -->
</template>

<script>
/* global $ */
import { mapActions, mapState } from 'vuex'
import InformationPopup from '@/components/pos/content/InformationPopup'
import CustomerForm from './CustomerForm'

export default {
  name: 'CreateNewCustomer',
  components: {
    InformationPopup,
    CustomerForm,
  },
  computed: {
    ...mapState({
      customerCreateStatus: state => state.customer.responseInformation,
    }),
  },
  methods: {
    ...mapActions('customer', ['CreateCustomer']),
    post() {
      const errors = this.$refs.form.validate()
      if (errors.count === 0) {
        const data = this.$refs.form.getData()
        this.CreateCustomer(data)
        if (
          this.customerCreateStatus &&
          this.customerCreateStatus.status == 1
        ) {
          $('#customer').modal('toggle')
          $('#information-popup').modal('toggle')
          $('#close-customer').click()
        } else {
          $('#information-popup').modal('toggle')
        }
      }
    },
  },
}
</script>
