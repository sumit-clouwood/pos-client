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
            <div class="select-driver">
              {{ _t('Select cancellation reason') }}
            </div>
            <div class="autocomplete-container">
              <div v-if="cancellationReason" class="driver-container">
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
              <div v-else class="drivers-list-note">
                {{ _t('No reason found') }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            {{ _t('Close') }}
          </button>
          <button type="button" class="btn btn-primary">
            {{ _t('Submit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
/* global $ */
export default {
  name: 'CancelOrderPopup',
  data() {
    return {
      showSelectedReason: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['cancellationReason']),
  },
  methods: {
    selectedReason: function(driver) {
      this.waitingOrder.driverId = driver._id
      this.selectedReason = driver.name
      /*this.selectDriver(driver)*/
      $('.dropdown-content').hide()
    },
    showDropdown: function() {
      $('.dropdown-content').show()
    },
  },
}
</script>

<style scoped></style>
