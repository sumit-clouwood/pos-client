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
                      @click="showDropdown('my-dropdown')"
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
                  class="driver-container"
                  v-if="enabled(CONST.MODULE_INVENTORY)"
                >
                  <div class="select-driver">
                    {{ _t('Inventory Behavior') }}
                  </div>
                  <form>
                    <input
                      autocomplete="off"
                      type="text"
                      class="input-search-driver"
                      id="get-behavior-list"
                      v-model="showSelectedBehavior"
                      @click="showDropdown('inventory-dropdown')"
                    />
                  </form>
                  <div
                    id="inventory-dropdown"
                    class="dropdown-content cancel-order-dd cursor-pointer"
                  >
                    <span
                      class="dropdown"
                      v-for="(behavior, i) in inventoryBehavior"
                      :key="i"
                      v-on:click="selectedBehavior(behavior)"
                      >{{ behavior }}
                    </span>
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
                  <p v-if="errorMessage.length > 0" class="text-danger">
                    {{ errorMessage }}
                  </p>
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
            <div class="btn-announce">
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
            <div class="btn-announce">
              <button type="button" class="btn btn-danger" data-dismiss="modal">
                {{ _t('Close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <InformationPopup :responseInformation="errorMessage" title="Alert" />
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapState, mapActions } from 'vuex'
import InformationPopup from '@/components/pos/content/InformationPopup'
import * as CONST from '@/constants'
export default {
  name: 'CancelOrderPopup',
  components: {
    InformationPopup,
  },
  data() {
    return {
      showSelectedReason: '',
      showSelectedBehavior: '',
      supervisorPassword: '',
      errorMessage: '',
      processing: false,
    }
  },
  props: {
    order: Object,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['cancellationReason', 'errors', 'inventoryBehavior']),
    ...mapGetters('modules', ['enabled']),
  },
  methods: {
    selectedReason: function(reason) {
      this.showSelectedReason = reason.name
      $('.dropdown-content').hide()
    },
    showDropdown: function(className) {
      $('#' + className).toggle()
    },
    selectedBehavior: function(behavior) {
      this.showSelectedBehavior = behavior
      $('#inventory-dropdown').hide()
    },
    cancelOrderAction: function(order) {
      if (this.showSelectedReason.length == 0) {
        this.errorMessage = 'Please select an inventory behavior'
        return false
      }
      if (this.processing) {
        return
      }
      this.processing = true
      let data = { cancel_reason: this.showSelectedReason }
      if (this.$store.state.location.brand.mandatory_password === true) {
        data = {
          cancel_reason: this.showSelectedReason,
          supervisor_password: this.supervisorPassword,
        }
      }
      if (this.enabled(CONST.MODULE_INVENTORY)) {
        data = {
          cancel_reason: this.showSelectedReason,
          supervisor_password: this.supervisorPassword,
          inventory_behavior: this.showSelectedBehavior,
        }
      }
      let orderType = order.order.order_type
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
                scope.$store.dispatch(
                  'transactionOrders/selectFirstTransactionOrder'
                )
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
              this.errorMessage = error
              $('#information-popup').modal('show')
            }
          }
          this.showSelectedReason = ''
          this.showSelectedBehavior = ''
          this.supervisorPassword = ''
        })
        .catch(error => {
          this.msg = error
          this.errorMessage = error
          $('#information-popup').modal('show')
        })
        .finally(() => {
          this.processing = false
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

<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
@include responsive(mobile) {
  #cancellationReason,
  #successCancel,
  #information-popup {
    position: fixed !important;
    .modal-body {
      min-height: 0rem !important;
    }
  }
  .dropdown-content .cancel-order-dd {
    margin-top: 15px !important;
    min-width: 100% !important;
  }
  .dropdown-content {
    top: 1em !important;
  }
  div#cancellationReason .modal-dialog .autocomplete-container {
    grid-template-columns: 1fr !important;
  }
  .dropdown-content span {
    white-space: nowrap;
  }
  .input-search-driver {
    width: 100%;
  }
  #cancellationReason .modal-header {
    max-width: 95%;
  }
  #successCancel {
    .modal-content {
      width: 95% !important;
    }
  }
}
</style>
