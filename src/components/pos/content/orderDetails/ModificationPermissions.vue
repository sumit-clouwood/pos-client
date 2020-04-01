<template>
  <div
    class="modal fade cancel-order"
    id="modificationReason"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modalOrderModification"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalOrderModificationTitle">
            {{ _t('Modify Order') }}
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="cancelPayment()"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="upper">
            <div class="autocomplete-container" v-if="modificationReasons">
              <div class="modifyperms-container">
                <div class="select-driver">{{ _t('Modification Reason') }}</div>
                <form>
                  <input
                    autocomplete="off"
                    type="text"
                    class="input-search-driver"
                    id="midification-reasons-list"
                    v-model="selectedReason"
                    @click="showDropdown"
                  />
                </form>
                <div id="my-dropdown" class="dropdown-content cursor-pointer">
                  <span
                    class="dropdown"
                    v-for="reason in modificationReasons"
                    :key="reason._id"
                    v-on:click="selectReason(reason)"
                    >{{ reason.name }}</span
                  >
                </div>
                <p v-if="errors && errors.modify_reason" class="text-danger">
                  {{ errors.modify_reason }}
                </p>
              </div>
              <div class="modifyperms-container" v-if="requiredSupervisor">
                <div class="select-driver">{{ _t('Supervisor Password') }}</div>
                <div>
                  <input
                    autocomplete="off"
                    type="password"
                    class="input-search-driver"
                    v-model="supervisorPassword"
                  />
                </div>
                <p
                  v-if="errors && errors.supervisor_password"
                  class="text-danger"
                >
                  {{ errors.supervisor_password }}
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
              class="btn btn-success"
              @click="
                modifyOrderAction({
                  order: selectedOrder.item,
                })
              "
            >
              {{ _t('Submit') }}
            </button>
            <button
              type="button"
              class="btn btn-danger"
              data-dismiss="modal"
              @click="cancelPayment()"
            >
              {{ _t('Close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
/* global $ hidePayNow */
export default {
  name: 'ModificationPermissions',
  data() {
    return {
      errors: {},
      selectedReason: '',
      supervisorPassword: '',
      errorMessage: '',
    }
  },
  components: {},
  computed: {
    requiredSupervisor() {
      return (
        this.$store.state.location.brand &&
        this.$store.state.location.brand.mandatory_password === true
      )
    },
    ...mapGetters('location', ['_t']),
    ...mapGetters('context', ['store']),
    ...mapState('order', ['modificationReasons', 'selectedOrder']),
    ...mapState('checkout', ['processing', 'changedAmount']),
  },
  methods: {
    cancelPayment() {
      this.$store.commit('checkoutForm/SET_PROCESSING', false)
    },
    selectReason: function(reason) {
      this.selectedReason = reason.name
      $('.dropdown-content').hide()
    },
    showDropdown: function() {
      $('.dropdown-content').toggle()
    },
    modifyOrderAction: function() {
      this.errors = {}
      let data = {
        modify_reason: this.selectedReason,
      }
      if (this.requiredSupervisor) {
        if (!this.supervisorPassword) {
          this.errors.supervisor_password =
            'Please provide supervisor password.'
        } else {
          data['supervisor_password'] = this.supervisorPassword
        }
      }

      if (!data.modify_reason) {
        this.errors.modify_reason = 'Please select modify reason.'
      }

      if (this.errors.modify_reason || this.errors.supervisor_password) {
        this.$store.commit('checkoutForm/SET_PROCESSING', false)
        return false
      }
      if (this.processing) {
        return false
      }
      this.$store.commit('checkoutForm/SET_PROCESSING', true)
      this.$store.dispatch('order/startOrder')
      $('#payment-msg').modal('show')
      this.$store
        .dispatch('checkout/pay', {
          action: 'modify-backend-order',
          data: data,
        })
        .then(() => {
          if (this.changedAmount >= 0.1) {
            setTimeout(() => {
              $('#payment-msg').modal('hide')
              setTimeout(() => {
                $('#change-amount').modal('show')
              }, 500)
            }, 500)
          } else if (this.msg) {
            $('#payment-msg').modal('show')
          }
          hidePayNow()
          //uncomment below lines ll not print invoice
          //this.$store.dispatch('checkout/reset', true)
          //this.$store.dispatch('order/reset')

          $('#modificationReason').hide()
          this.$store.commit('order/ORDER_SOURCE', null)
          this.$router.push(this.store)
        })
        .catch(response => {
          this.errorMessage =
            response.data.error !== 'undefined'
              ? response.data.error
              : response.data.form_errors
              ? response.data.form_errors[
                  Object.keys(response.data.form_errors)[0]
                ][0]
              : response.data
        })
        .finally(() => {
          this.$store.commit('checkoutForm/SET_PROCESSING', false)
        })
    },
    ...mapActions('order', ['selectedOrderDetails']),
  },
  mounted() {
    const self = this
    $(document).on('hidden.bs.modal', '#modificationReason', () => {
      // do something…
      self.cancelPayment()
    })
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

#modificationReason {
  .modal-dialog {
    /*margin: 0;*/

    .modal-content {
      .modal-header {
        height: 80px;
        background-color: #fff;
      }
      .modifyperms-container {
        padding-bottom: 10px;
      }
    }
  }
}

@include responsive(mobile) {
  #modificationReason {
    .modal-dialog {
      margin: 0 !important;
      #my-dropdown {
        position: relative !important;
        top: 0px !important;
        max-height: 5rem !important;
        overflow: scroll !important;
      }
      .modal-content {
        .modal-header {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: none;
        }

        .modal-footer {
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}
</style>
