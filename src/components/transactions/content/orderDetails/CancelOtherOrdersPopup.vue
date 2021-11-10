<template>
  <div>
    <div
      class="modal fade"
      id="cancellationReasonOtherOrders"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="">
              {{ _t('Reject Order') }}
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
              <div class="autocomplete-container">
                <div class="driver-container">
                  <div class="select-driver">
                    {{ _t('Rejection Message') }}
                  </div>
                  <form>
                    <input
                      autocomplete="off"
                      type="text"
                      class="input-search-driver"
                      id="get-customer-list"
                      v-model="showSelectedReasonMsg"
                      @click="showDropdown('my-dropdown')"
                    />
                  </form>
                  <div
                    id="my-dropdown"
                    class="dropdown-content cursor-pointer rejection-reason"
                  >
                    <span
                      class="dropdown"
                      v-for="(index, value) in reasons"
                      :key="index"
                      v-on:click="selectedReason(value, index)"
                      >{{ value }}</span
                    >
                  </div>
                </div>
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
                @click="orderAction"
              >
                {{ _t('Submit') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
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
export default {
  name: 'CancelOtherOrdersPopup',
  components: {
    InformationPopup,
  },
  data() {
    return {
      showSelectedReason: undefined,
      showSelectedReasonMsg: undefined,
      errorMessage: '',
      processing: false,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['errors', 'inventoryBehavior', 'zometoOrder']),
    ...mapGetters('modules', ['enabled']),
    reasons() {
      return {
        'Items out of stock': 1,
        'No delivery boys available': 2,
        'Nearing closing time': 3,
        'Out of Subzone/Area': 4,
        'Kitchen is Full': 5,
        'Merchant device issue': 6,
        'Outlet Closed': 7,
      }
    },
  },
  methods: {
    selectedReason: function(reason, id) {
      this.showSelectedReasonMsg = reason
      this.showSelectedReason = id
      $('.dropdown-content').hide()
    },
    showDropdown: function(className) {
      $('#' + className).toggle()
    },
    orderAction: function() {
      if (!this.showSelectedReason) {
        this.errorMessage = 'Zomato rejection message is required.'
        $('#information-popup').modal('show')
        return false
      }
      this.$store.commit('deliveryManager/SET_LOADING', true)
      // this.processing = true
      let data = {
        message: { zomato_rejection_message_id: this.showSelectedReason },
        id: this.zometoOrder._id,
      }
      this.zometoOrderRejection(data)
        .then(response => {
          if (
            response.data.status !== 'fail' &&
            response.data.status !== 'form_errors'
          ) {
            closeModal('#cancellationReasonOtherOrders')
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

              closeModal('#cancellationReasonOtherOrders')
            }
            if (response.data.status != 'ok') {
              this.errorMessage = error
              $('#information-popup').modal('show')
              closeModal('#cancellationReasonOtherOrders')
            }
          }
          this.$store.dispatch('deliveryManager/getOnlineOrders')

          // this.$store.commit('deliveryManager/SET_LOADING', false)

          this.showSelectedReason = undefined
          this.showSelectedBehavior = undefined
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
    ...mapActions('order', ['zometoOrderRejection']),
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
.rejection-reason {
  width: 100% !important;
  padding: 9px 18px 10px 10px;
  span {
    padding: 0.775rem 1rem !important;
  }
}
@include responsive(mobile) {
  #cancellationReasonOtherOrders,
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
  div#cancellationReasonOtherOrders .modal-dialog .autocomplete-container {
    grid-template-columns: 1fr !important;
  }
  .dropdown-content span {
    white-space: nowrap;
  }
  .input-search-driver {
    width: 100%;
  }
  #cancellationReasonOtherOrders .modal-header {
    max-width: 95%;
  }
  #successCancel {
    .modal-content {
      width: 95% !important;
    }
  }
}
</style>
