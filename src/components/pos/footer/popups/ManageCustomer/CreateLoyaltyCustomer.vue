<template>
  <!-- Add customer model -->
  <div>
    <div class="modal fade " id="customer-loyalty" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <!-- Modal content-->
        <div class="modal-content color-dashboard-background">
          <div class="modal-header customer-header color-secondary">
            <h4 class="customer-title color-text">
              {{ _t('Create customer') }}
            </h4>
            <button type="button" class="close color-text" data-dismiss="modal">
              &times;
            </button>
          </div>
          <preloader v-if="loader"></preloader>
          <!--Customer form-->
          <CustomerForm ref="form" />
          <!--Customer form-->

          <div class="modal-footer">
            <div class="btn-announce">
              <button
                class="btn btn-success btn-large color-main"
                type="button"
                id="create-loyalty-customer"
                v-on:click="customerAction()"
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
  </div>
  <!-- End customer Model -->
</template>

<script>
/*global $ */
import { mapActions, mapGetters, mapState } from 'vuex'
import CustomerForm from './LoyaltyCustomerForm'
import Preloader from '@/components/util/progressbar'

export default {
  name: 'CreateLoyaltyCustomer',
  components: {
    Preloader,
    CustomerForm,
  },
  data() {
    return {
      error: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('loyalty', ['customer_status', 'loader']),
    ...mapState('order', ['orderType']),
  },
  methods: {
    ...mapActions('loyalty', ['createCustomer']),
    displayValidationErrors(errorData) {
      let error = ''
      let validationError = {}
      // eslint-disable-next-line no-debugger
      if (errorData) {
        if (errorData['status'] == 'form_errors') {
          $.each(errorData['message'], function(key, val) {
            $.each(val, function(index, data) {
              error += data
            })
          })
        }

        if (errorData['status'] == 'fail') {
          error += errorData.error.flash_message
        }
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
        $('#customer-loyalty').modal('toggle')
        $('#information-popup').modal('show')
      } else {
        $('#create-loyalty-customer').attr('disabled', false)
        $('#information-popup').modal('show')
      }
    },
    customerAction() {
      const errors = this.$refs.form.validate()
      if (errors.count === 0) {
        // $('#create-loyalty-customer').attr('disabled', true) //Disable Save button if pressed
        let customerData = this.$refs.form.getData()
        if (this.orderType.OTApi !== 'carhop') {
          delete customerData.car_number
        }
        this.createCustomer(customerData).then(() => {
          let errorData = this.customer_status
          this.displayValidationErrors(errorData)
          $('#create-loyalty-customer').attr('disabled', false)
          $('#customer-loyalty').modal('hide')
        })
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
  #create-loyalty-customer {
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
