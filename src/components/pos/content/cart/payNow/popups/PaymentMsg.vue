<template>
  <!-- Amount change -->
  <div class="modal fade" id="payment-msg" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content" v-if="msg">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">
            {{ _t('Order') }}
          </h4>
        </div>
        <div class="modal-body change-amount-option">
          <div class="amount-change-wrap">
            <h2 v-if="msg.data && msg.data !== 'loading'">
              {{ msg.data }}
            </h2>
            <Preloader v-else />
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce" v-if="msg.result === 'success'">
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              @click="generateInvoice()"
              id="dining-opt"
            >
              {{ _t('Ok') }}
            </button>
          </div>
          <button
            v-if="msg.result !== 'success'"
            type="button"
            class="btn btn-default"
            data-dismiss="modal"
          >
            {{ _t('Close') }}
          </button>
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
  },
  computed: {
    ...mapState('checkoutForm', ['msg']),
    ...mapGetters('location', ['_t']),
  },
}
</script>
