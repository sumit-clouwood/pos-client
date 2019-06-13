<template>
  <!-- Add customer model -->
  <div class="modal fade" id="customer" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <h4 class="customer-title">
            {{ customer_title }} {{ _t('customer') }}
          </h4>
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
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large"
              type="button"
              id="post_announcement"
              v-on:click="customerAction(customer_title)"
            >
              {{ _t('Save') }}
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
/*global $ */
import { mapActions, mapState, mapGetters } from 'vuex'
import InformationPopup from '@/components/pos/content/InformationPopup'
import CustomerForm from './CustomerForm'

export default {
  name: 'CreateNewCustomer',
  components: {
    InformationPopup,
    CustomerForm,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({
      customer_title: state => state.customer.modalStatus,
      customerCreateStatus: state => state.customer.responseInformation,
    }),
  },
  methods: {
    ...mapActions('customer', ['createAction', 'updateAction']),
    customerAction(modalStatus) {
      const errors = this.$refs.form.validate()
      if (errors.count === 0) {
        const customerData = this.$refs.form.getData()
        if (modalStatus == 'Add') {
          this.createAction({
            data: customerData,
            model: 'brand_customers',
            customer: false,
          })
        }
        if (modalStatus == 'Edit') {
          let actionDetails = {
            id: localStorage.getItem('editItemKey'),
            action: 'edit',
            model: 'brand_customers',
            data: customerData,
          }
          this.updateAction(actionDetails)
        }
        if (
          this.customerCreateStatus &&
          this.customerCreateStatus.status === 'ok'
        ) {
          $('#customer')
            .find('input:text')
            .val('')
          // $('#close-customer').click()
          // $('#customer').modal('toggle')
        } else {
          // $('#information-popup').modal('toggle')
        }
        setTimeout(function() {
          $('#information-popup').modal('toggle')
          $('#information-popup').modal('show')
        }, 300)
      }
    },
  },
}
</script>
