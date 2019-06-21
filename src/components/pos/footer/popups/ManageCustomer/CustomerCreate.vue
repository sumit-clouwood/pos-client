<template>
  <!-- Add customer model -->
  <div>
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

          <!--Customer form-->
          <CustomerForm ref="form" />
          <!--Customer form-->

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
    </div>
    <InformationPopup
      v-if="customerCreateStatus.status !== 0"
      :responseInformation="customerCreateStatus.message.flash_message"
      :title="customerCreateStatus.message.flash_message"
    />
    <InformationPopup
      v-if="customerCreateStatus.status == 0"
      :responseInformation="customerCreateStatus.message.flash_message"
      :title="customerCreateStatus.message.title"
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
    displayValidationErrors(errorData) {
      if (errorData && errorData['status'] == 'form_errors') {
        let validationError = {}
        let error = ''
        $.each(errorData['message'], function(key, val) {
          $.each(val, function(index, data) {
            error += key.replace(/_/g, ' ') + ' : ' + data
          })
        })
        validationError = {
          status: 0,
          title: 'Validation Error',
          flash_message: error,
        }
        this.$store.commit('customer/SET_RESPONSE_MESSAGES', validationError)
      }
    },
    customerAction(modalStatus) {
      const errors = this.$refs.form.validate()
      if (errors.count === 0) {
        $('#post_announcement').attr('disabled', true) //Disable Save button if pressed
        const customerData = this.$refs.form.getData()
        if (modalStatus == 'Add') {
          this.createAction({
            data: customerData,
            model: 'brand_customers',
            customer: false,
          }).then(() => {
            let errorData = this.customerCreateStatus
            this.displayValidationErrors(errorData)
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
        /*if (
          this.customerCreateStatus &&
          this.customerCreateStatus.status === 'ok'
        ) {}*/
        $('#close-customer').click()
        $('#customer').modal('toggle')
        $('#information-popup').modal('show')
      }
    },
  },
}
</script>
