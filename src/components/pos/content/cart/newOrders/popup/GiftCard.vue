<template>
  <div
    class="modal fade"
    id="Gift-card-payemnt"
    role="dialog"
    style="display: none; padding-left: 6px;"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Gift Card') }}
          </h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p class="color-text-invert">{{ _t('Enter Gift Card Code') }}</p>
            <form>
              <input
                type="text"
                class="add-email-from"
                v-model="code"
                @keydown.space.prevent
                @change.space.prevent
              />
            </form>
          </div>
          <div v-show="error" class="msg">
            <p class="text-danger color-warning">{{ error }}</p>
          </div>
          <div v-show="msg" class="msg">
            <p class="text-info color-text">{{ msg }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              @click="cancelPayment"
              type="button"
              class="btn btn-danger cancel-announce color-text-invert color-button"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save color-text-invert color-main"
              type="button"
              id="gift-card-btn"
              data-toggle="modal"
              data-target="#Gift-card-payemnt-details"
              @click="payByGiftCard"
            >
              {{ _t('Add') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
/* global showModal, hideModal */
import CheckoutMixin from '@/mixins/Checkout'

export default {
  name: 'GiftCard',
  mixins: [CheckoutMixin],
  data: function() {
    return {
      code: '',
      error: false,
      msg: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['needSupervisorAccess']),
  },
  methods: {
    cancelPayment() {
      this.$store.commit('checkoutForm/SET_PROCESSING', false)
    },
    payByGiftCard() {
      this.msg = 'Fetching gift card...'
      this.error = null
      this.$store
        .dispatch('checkoutForm/addGiftCardAmount', this.code.trim())
        .then(payable => {
          this.error = false
          this.$store.commit('checkoutForm/showPayBreak', true)
          if (
            payable <= 0.1 ||
            this.$store.state.checkoutForm.action == 'pay'
          ) {
            if (this.$store.getters['checkoutForm/validate']) {
              if (this.needSupervisorAccess) {
                showModal('#modificationReason')
              } else {
                hideModal('#Gift-card-payemnt')
                this.executePayment(this.$store.state.order.orderType.OTApi)
                  .then(() => {
                    this.code = ''
                    showModal('#gift-card-info')
                  })
                  .catch(() => {
                    showModal('#Gift-card-payemnt')
                  })
              }
            }
          }
        })
        .catch(error => {
          this.error = error
          this.$store.commit('checkoutForm/showPayBreak', true)
        })
        .finally(() => {
          this.msg = null
          this.$store.commit('checkoutForm/SET_PROCESSING', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.msg {
  padding-top: 20px;
}

@include responsive(mobile) {
  #Gift-card-payemnt {
    padding: 0 !important;

    .modal-dialog {
      position: fixed;
      top: auto;
      right: 0;
      bottom: 0;
      left: 0;
      margin: 0;
      transform: none;
      animation: none;

      .modal-content {
        top: auto;

        .modal-header {
          height: 80px;
          background-color: #fff;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: none;
        }
        .modal-footer {
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          .btn-announce {
            #gift-card-btn {
              background-color: $green-middle;
            }
          }
        }
      }
    }
  }
}
</style>
