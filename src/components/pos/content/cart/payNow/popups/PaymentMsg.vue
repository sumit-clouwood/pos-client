<template>
  <!-- Amount change -->
  <div class="modal fade" id="payment-msg" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background" v-if="msg">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Order') }}
          </h4>
          <span
            class="cursor-pointer top-round-close-button"
            data-dismiss="modal"
          >
            X
          </span>
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
          <div class="btn-announce" v-if="msg.result === 'success'">
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
          </div>
          <div
            class="btn-announce"
            v-if="msg.result !== 'success' && msg.result !== 'confirm'"
          >
            <button
              type="button"
              class="btn btn-success btn-large"
              data-dismiss="modal"
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
    generateInvoice() {
      $('#pay-now').modal('hide')
      this.$store.dispatch('checkout/generateInvoice')
      $('#transparent-screen').hide()
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
