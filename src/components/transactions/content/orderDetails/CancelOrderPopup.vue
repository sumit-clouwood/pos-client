<template>
  <div>
    <div
      class="modal fade cancel-order"
      id="cancellationReason"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              {{ _t('Cancel Order') }}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="upper">
              <p
                v-if="errors && errors.error && errors.error.length"
                class="text-danger text-center"
              >
                {{ errors.error.toString() }}
              </p>
              <div class="autocomplete-container" v-if="cancellationReason">
                <div class="driver-container">
                  <div class="select-driver">
                    {{ _t('Cancellation Reason') }}
                  </div>
                  <form>
                    <input
                      autocomplete="off"
                      type="text"
                      class="input-search-driver"
                      id="get-customer-list"
                      v-model="showSelectedReason"
                      @click="showDropdown"
                    />
                  </form>
                  <div id="my-dropdown" class="dropdown-content cursor-pointer">
                    <span
                      class="dropdown"
                      v-for="reason in cancellationReason"
                      :key="reason._id"
                      v-on:click="selectedReason(reason)"
                      >{{ reason.name }}</span
                    >
                  </div>
                </div>
                <div
                  v-if="
                    this.$store.state.location.brand.mandatory_password === true
                  "
                >
                  <div class="select-driver">
                    {{ _t('Supervisor Password') }}
                  </div>
                  <div>
                    <input
                      autocomplete="off"
                      type="password"
                      class="input-search-driver"
                      v-model="supervisorPassword"
                    />
                  </div>
                  <p
                    v-if="
                      errors &&
                        errors.supervisor_password &&
                        errors.supervisor_password.length
                    "
                    class="text-danger"
                  >
                    {{ errors.supervisor_password.toString() }}
                  </p>
                </div>
              </div>
              <div v-else class="drivers-list-note">
                {{ _t('No reason found') }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">
              {{ _t('Close') }}
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="
                cancelOrderAction({
                  order,
                })
              "
            >
              {{ _t('Submit') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade cancel-order"
      id="successCancel"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ _t('Cancel Order') }}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="upper">
              <div class="drivers-list-note">
                {{ _t('Order cancelled successfully') }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">
              {{ _t('Close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <InformationPopup :responseInformation="this.msg" title="Alert" />
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapState, mapActions } from 'vuex'
import InformationPopup from '@/components/pos/content/InformationPopup'
export default {
  name: 'CancelOrderPopup',
  components: {
    InformationPopup,
  },
  data() {
    return {
      showSelectedReason: '',
      supervisorPassword: '',
      msg: null,
    }
  },
  props: {
    order: Object,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['cancellationReason', 'errors']),
  },
  methods: {
    selectedReason: function(reason) {
      this.showSelectedReason = reason.name
      $('.dropdown-content').hide()
    },
    showDropdown: function() {
      $('.dropdown-content').show()
    },
    cancelOrderAction: function(order) {
      let data = {
        cancel_reason: this.showSelectedReason,
      }
      if (this.$store.state.location.brand.mandatory_password === true) {
        data = {
          cancel_reason: this.showSelectedReason,
          supervisor_password: this.supervisorPassword,
        }
      }
      let orderType = order.order.order_type
      let orderId = order.order._id
      let actionTrigger = 'cancel_order'
      this.updateOrderCancelAction({
        order,
        orderType,
        actionTrigger,
        params: data,
      })
        .then(response => {
          // eslint-disable-next-line no-console
          console.log(response)
          if (
            response.data.status !== 'fail' &&
            response.data.status !== 'form_errors'
          ) {
            //Reload order list again.
            let scope = this
            scope.$store
              .dispatch('transactionOrders/getTransactionOrders', {
                root: true,
              })
              .then(function() {
                scope.$store.dispatch('order/selectedOrderDetails', orderId)
              })
            closeModal('#cancellationReason')
            showModal('#successCancel')
          } else {
            let error = ''
            if (response.data.status == 'form_errors') {
              for (let i in response.data.form_errors) {
                response.data.form_errors[i].forEach(
                  err => (error += ' ' + err)
                )
              }
            } else {
              error =
                typeof response.data.error !== 'undefined'
                  ? response.data.error
                  : response.data.message
            }
            if (response.data.status != 'ok') {
              this.msg = error
              $('#information-popup').modal('show')
            }
          }
        })
        .catch(error => {
          this.msg = error
          $('#information-popup').modal('show')
        })
    },
    ...mapActions('order', ['updateOrderCancelAction']),
  },
}
function closeModal(modalName) {
  $('body').removeClass('modal-open')
  $('#transparent-screen').css('display', 'none')
  $(modalName).modal('hide')
}
function showModal(modalName) {
  $(modalName).modal('show')
}
</script>
