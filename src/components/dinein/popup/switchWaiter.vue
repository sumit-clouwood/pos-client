<template>
  <div class="modal fade" id="switchWaiter" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('Select Waiter') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div id="available-tables" class="available-tables cursor-pointer">
            <div class="table-status-container">
              <span
                class="table-status"
                style="text-align:center"
                :class="{ active: assignedWaiter._id === waiter._id }"
                v-for="(waiter, index) in waiters"
                :key="index"
                @click="select(waiter)"
              >
                <span v-html="waiter.name"></span>
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              @click="switchWaiter(selectedWaiter)"
            >
              {{ _t('Assign') }}
            </button>
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button color-text-invert"
              data-dismiss="modal"
              @click="resetWaiter"
            >
              {{ _t('Cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <information-popup
      :responseInformation="this.msg"
      title="Alert"
    ></information-popup>
  </div>
</template>

<script>
/* global $ */
import InformationPopup from '@/components/pos/content/InformationPopup'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'DineInCoverSelection',
  data() {
    return {
      selectedWaiter: null,
      msg: '',
    }
  },
  components: {
    InformationPopup,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('auth', ['waiters', 'userDetails']),
    assignedWaiter() {
      return (
        this.selectedWaiter || {
          _id: this.$store.state.dinein.reservationData
            ? this.$store.state.dinein.reservationData.assigned_to
            : null,
        }
      )
    },
  },
  methods: {
    select: function(waiter) {
      this.selectedWaiter = waiter
    },
    resetWaiter() {
      this.selectedWaiter = null
    },
    switchWaiter(waiter) {
      this.$store
        .dispatch('dinein/switchWaiter', waiter)
        .then(() => {
          //show info popupzx
          this.msg = 'Waiter assigned to table.'
        })
        .catch(error => (this.msg = error.message))
        .finally(() => {
          $('.information-popup').modal('show')
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #switchWaiter {
    overflow: hidden !important;
    .modal-dialog {
      max-width: 100% !important;
      margin: 0px !important;
      margin-top: 2rem !important;
      .modal-content {
        width: 95% !important;
        margin: auto !important;
        .modal-body {
          padding-left: 0px !important;
          padding-right: 0px !important;
          width: 90%;
        }
        #available-tables {
          width: 100%;
          .table-status-container {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      }
    }
  }
}
</style>
