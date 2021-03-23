<template>
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
            {{ _t(cancelOrRefund) }}
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
            <div class="autocomplete-container" v-if="cancellationReason">
              <div class="driver-container">
                <div class="select-driver">{{ _t('Cancellation Reason') }}</div>
                <form>
                  <input
                    autocomplete="off"
                    type="text"
                    class="input-search-driver"
                    id="get-customer-list"
                    v-model="showSelectedReason"
                    @click="showDropdown('cancellation-dropdown')"
                  />
                </form>
                <div
                  id="cancellation-dropdown"
                  class="dropdown-content cancel-order-dd cursor-pointer"
                >
                  <span
                    class="dropdown"
                    v-for="reason in cancellationReason"
                    :key="reason._id"
                    v-on:click="selectedReason(reason)"
                    >{{ reason.name }}</span
                  >
                </div>
                <p v-if="errors && errors.cancel_reason" class="text-danger">
                  {{ errors.cancel_reason }}
                </p>
              </div>
              <div
                class="driver-container"
                v-if="enabled(CONST.MODULE_INVENTORY)"
              >
                <div class="select-driver">{{ _t('Inventory Behavior') }}</div>
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
                <p v-if="errorMessage.length > 0" class="text-danger">
                  {{ errorMessage }}
                </p>
              </div>
              <div
                v-if="
                  this.$store.state.location.brand &&
                    this.$store.state.location.brand.mandatory_password === true
                "
              >
                <div class="select-driver">{{ _t('Supervisor Password') }}</div>
                <div>
                  <form>
                    <input
                      autocomplete="off"
                      type="password"
                      class="input-search-driver"
                      v-model="supervisorPassword"
                    />
                  </form>
                </div>
                <p
                  v-if="errors && errors.supervisor_password"
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
            <button
              type="button"
              class="btn btn-danger"
              data-dismiss="modal"
              @click="clearOrder()"
            >
              {{ _t('Close') }}
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="
                cancelOrderAction({
                  order: selectedOrder.item,
                })
              "
            >
              {{ _t('Submit') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <InformationPopup :responseInformation="errorMessage" title="Alert" />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import InformationPopup from '@/components/pos/content/InformationPopup'
import * as CONST from '@/constants'
/* global $ */
export default {
  name: 'CancelOrderPopup',
  data() {
    return {
      showSelectedReason: '',
      showSelectedBehavior: '',
      supervisorPassword: '',
      errorMessage: '',
      processing: false,
    }
  },
  components: {
    InformationPopup,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', [
      'cancellationReason',
      'selectedOrder',
      'errors',
      'inventoryBehavior',
    ]),
    ...mapGetters('modules', ['enabled']),
    cancelOrRefund() {
      return this.isRefundAllow ? 'Refund Order' : 'Cancel Order'
    },
    ...mapState('customer', ['isRefundAllow']),
    ...mapGetters('context', ['store']),
  },
  methods: {
    clearOrder() {
      this.$store.commit('order/CLEAR_SELECTED_ORDER', null, {
        root: true,
      })
    },
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
      if (
        this.$store.state.location.brand &&
        this.$store.state.location.brand.mandatory_password === true
      ) {
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
      let orderType = 'call_center'
      let actionTrigger = this.isRefundAllow ? 'refund_order' : 'cancel_order'
      this.updateOrderCancelAction({
        order,
        orderType,
        actionTrigger,
        params: data,
      })
        .then(res => {
          if (res.data.status != 'form_errors') {
            this.$store.commit('customer/IS_REFUND_ALLOW', false, {
              root: true,
            })
            $('#cancellationReason').hide()
            $('#orderDetailsPopup').hide()

            if (this.selectedOrder.item.order_type == 'dine_in')
              this.dineInRunningOrders()
            else if (this.selectedOrder.item.order_type == 'call_center')
              this.deliveryOrder()
          }
          this.showSelectedReason = ''
          this.showSelectedBehavior = ''
          this.supervisorPassword = ''
        })
        .catch(response => {
          this.errorMessage = response
          $('#information-popup').modal('show')
        })
        .finally(() => {
          this.processing = false
        })
    },
    ...mapActions('order', ['selectedOrderDetails', 'updateOrderCancelAction']),
    ...mapActions('dinein', ['dineInRunningOrders', 'deliveryOrder']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

#cancellationReason {
  .modal-dialog {
    /*margin: 0;*/
  }
  #cancellation-dropdown,
  #inventory-dropdown {
    width: 100% !important;
  }
}

#cancellationReason {
  .modal-dialog {
    /*margin: 0;*/

    .modal-content {
      .modal-header {
        height: 80px;
        background-color: #fff;
      }

      .modal-body {
      }

      .modal-footer {
      }
    }
  }
}

@include responsive(mobile) {
  #cancellationReason {
    .modal-dialog {
      .modal-content {
        .modal-header {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: none;
        }

        .modal-body {
          min-height: 0rem;
          .autocomplete-container {
            grid-gap: 1em;
            .dropdown-content {
              top: 4em !important;
              background-color: #fff !important;
              max-height: inherit !important;
              bottom: inherit;
            }
          }
        }

        .modal-footer {
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  #cancellationReason {
    position: fixed !important;
    .modal-content {
      width: 95% !important;
      margin: 20% auto;
    }
    .modal-body {
      min-height: 0rem !important;
    }
  }
  .dropdown-content .cancel-order-dd {
    margin-top: 15px !important;
    min-width: 100% !important;
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
    max-width: 100%;
  }
  #successCancel {
    .modal-content {
      width: 95% !important;
    }
  }
}
</style>
