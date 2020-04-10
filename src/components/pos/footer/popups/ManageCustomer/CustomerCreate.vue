<template>
  <!-- Add customer model -->
  <div>
    <div class="modal fade " id="customer" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <!-- Modal content-->
        <div class="modal-content color-dashboard-background">
          <div class="modal-header customer-header color-secondary">
            <h4 class="customer-title color-text">
              {{ customer_title }} {{ _t('customer') }}
            </h4>
            <button type="button" class="close color-text" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!--Customer form-->
          <CustomerForm ref="form" />
          <!--Customer form-->

          <div class="modal-footer">
            <div class="btn-announce">
              <button
                class="btn btn-success btn-large color-main"
                type="button"
                id="post_announcement"
                v-on:click="customerAction(customer_title)"
              >
                {{ _t('Save') }}
              </button>
              <button
                type="button"
                class="btn btn-danger cancel-announce color-button"
                data-dismiss="modal"
                id="close-customer"
              >
                {{ _t('Cancel') }}
              </button>
            </div>
            <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
          </div>
        </div>
      </div>
    </div>
    <InformationPopup
      :responseInformation="customerCreateStatus.message.flash_message"
      title="Information"
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
  data() {
    return {
      error: '',
    }
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
      let error = ''
      let validationError = {}
      if (errorData && errorData['status'] == 'form_errors') {
        $.each(errorData['message'], function(key, val) {
          $.each(val, function(index, data) {
            error += data
          })
        })
        validationError = {
          status: 'flash_message',
          flash_message: error,
        }
        this.$store.commit('customer/SET_RESPONSE_MESSAGES', validationError)
      }
      if (error == '') {
        validationError = {
          status: 'flash_message',
          flash_message: 'Customer Added Successfully',
        }
        this.$store.commit('customer/SET_RESPONSE_MESSAGES', validationError)
        $('#close-customer').click()
        $('#customer').modal('toggle')
        $('#information-popup').modal('show')
      } else {
        $('#post_announcement').attr('disabled', false)
        $('#information-popup').modal('show')
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
          $('#close-customer').click()
          $('#post_announcement').attr('disabled', false)
          $('#information-popup').modal('show')
        }
        /*if (
                      this.customerCreateStatus &&
                      this.customerCreateStatus.status === 'ok'
                    ) {}*/
      }
    },
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #post_announcement {
    background-color: $green-middle;
    border: none;
  }
  .new-pos #customer {
    display: none;
  }
  #customer {
    position: fixed !important;
    top: 0;
    right: -100vw;
    bottom: 0;
    left: auto;
    width: 100vw;
    opacity: 1;
    transform: none;
    transition: 0.5s ease-out;
    display: block;

    &.show {
      top: 0;
      right: 0;
      bottom: 0;
      left: auto;
    }

    .modal-dialog {
      transform: none;

      .modal-content {
        display: grid;
        grid-template-rows: max-content 1fr max-content;

        .modal-header {
          height: 80px;
          background-color: #fff;
        }

        form {
          overflow-y: auto;
          overflow-x: hidden;
          width: 95vw !important;
        }

        .modal-body {
          width: 100vw;
          .divide-block {
            margin: 0;
            border: none;
            display: grid;

            .customer-block-info {
              padding: 0;
              position: static;
            }
          }
        }

        .modal-footer {
          z-index: 1;
          min-height: 0px !important;
          .btn-announce {
            margin-bottom: 0px !important;
          }
        }
      }
    }
  }
}
</style>
