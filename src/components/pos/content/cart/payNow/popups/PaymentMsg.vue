<template>
  <!-- Amount change -->
  <div class="modal fade" id="payment-msg" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background" v-if="msg">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ msg.result === 'error' ? _t('Error') : _t('Order') }}
          </h4>
        </div>
        <div class="modal-body change-amount-option">
          <div class="amount-change-wrap">
            <h5
              class="color-text"
              v-if="msg.message && msg.message !== 'loading'"
            >
              {{ msg.message }}
            </h5>
            <Preloader v-else />
          </div>
        </div>
        <div class="modal-footer">
          <div
            class="btn-announce"
            v-if="msg.result === 'success' || msg.result === 'error'"
          >
            <button
              class="btn btn-success btn-large color-main"
              type="button"
              data-dismiss="modal"
              @click="generateInvoice()"
              id="dining-opt"
            >
              {{ _t('Ok') }}
            </button>
          </div>
          <div class="btn-announce" v-if="msg.result === 'confirm'">
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              @click="
                confirmDelete({
                  records: msg.record,
                  flag: msg.flag,
                })
              "
            >
              {{ _t('Confirm') }}
            </button>
            <button
              type="button"
              class="btn btn-danger btn-large"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
          </div>
          <div class="btn-announce" v-if="msg.result == ''">
            <button
              type="button"
              class="btn btn-success btn-large"
              data-dismiss="modal"
              @click="acceptMsg()"
            >
              {{ _t('Ok') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- End Amount change  -->
</template>

<script>
import { mapGetters } from 'vuex'
/* global $ */
import { mapState } from 'vuex'
import Preloader from '@/components/util/Preloader'

export default {
  name: 'PaymentMsg',
  components: {
    Preloader,
  },
  methods: {
    acceptMsg() {
      this.$store.commit('checkout/PAYMENT_MSG_STATUS', true)
    },
    generateInvoice() {
      $('#pay-now').modal('hide')
      this.$store.dispatch('checkout/generateInvoice')
      $('#transparent-screen').hide()
      this.$store.commit('checkout/PAYMENT_MSG_STATUS', true)
    },
    confirmDelete(resultLoad) {
      if (resultLoad.flag === 'hold order') {
        this.$store.dispatch('order/removeOrder', {
          order: resultLoad.records,
          orderType: 'hold',
        })
        this.$store.dispatch('holdOrders/getHoldOrders')
      } else if (resultLoad.flag === 'customer address') {
        this.$store.dispatch('customer/updateAction', resultLoad.records)
      }
    },
  },
  computed: {
    ...mapState('checkoutForm', ['msg']),
    ...mapGetters('location', ['_t']),
  },
}
</script>
<style lang="scss">
@import '../../../../../../assets/scss/pixels_rem.scss';
@import '../../../../../../assets/scss/variables.scss';
@import '../../../../../../assets/scss/mixins.scss';

@include responsive(mobile) {
  #payment-msg {
    .modal-dialog {
      margin: 0;

      .modal-content {
        .modal-header {
          height: 80px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: none;
        }

        .modal-body {
        }

        .modal-footer {
        }
      }
    }
  }
}
</style>
