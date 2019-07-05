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
            <div class="autocomplete-container" v-if="cancellationReason">
              <div class="driver-container">
                <div class="select-driver">
                  {{ _t('Cancellation Reason') }}
                </div>
                <input
                  autocomplete="off"
                  type="text"
                  class="input-search-driver"
                  id="get-customer-list"
                  v-model="showSelectedReason"
                  @click="showDropdown"
                />
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
              <div>
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
                order: selectedOrder.item,
                actionTrigger: 'cancel_order',
              })
            "
          >
            {{ _t('Submit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
/* global $ */
export default {
  name: 'CancelOrderPopup',
  data() {
    return {
      showSelectedReason: '',
      supervisorPassword: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['cancellationReason', 'selectedOrder']),
  },
  methods: {
    selectedReason: function(reason) {
      this.showSelectedReason = reason.name
      $('.dropdown-content').hide()
    },
    showDropdown: function() {
      $('.dropdown-content').show()
    },
    cancelOrderAction: function(order, actionTrigger) {
      let params = {
        cancel_reason: this.showSelectedReason,
        supervisor_password: this.supervisorPassword,
      }
      this.updateOrderAction(order, 'call_center', actionTrigger, params)
    },
    ...mapActions('order', ['selectedOrderDetails', 'updateOrderAction']),
  },
}
</script>

<style scoped></style>
