<template>
  <!-- Amount change -->
  <div class="modal fade" id="payment-msg" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
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
            <template v-if="msg.message && msg.message !== 'loading'">
              <h5 class="color-text">
                {{ msg.message }}
              </h5>
              <div v-if="msg.desc">
                <div class="smalldesc" :class="{ expand: expandedCss }">
                  {{ msg.desc }}
                </div>
                <a href="#" @click.prevent="expandError">Read more</a>
              </div>
            </template>
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
/* global $ hideModal */
import { mapState } from 'vuex'
import Preloader from '@/components/util/Preloader'

export default {
  name: 'PaymentMsg',
  components: {
    Preloader,
  },
  data() {
    return {
      expandedCss: false,
    }
  },
  methods: {
    expandError() {
      this.expandedCss = !this.expandedCss
    },
    acceptMsg() {
      hideModal('#pay-now')
      hideModal('#payment-msg')
      if (this.msg.result !== 'error') {
        this.$store.commit('checkout/PAYMENT_MSG_STATUS', true)
        this.$store.dispatch('checkout/generateInvoice')
      }
    },
    generateInvoice() {
      if (this.msg.result !== 'error') {
        hideModal('#pay-now')
        hideModal('#payment-msg')
        this.$store.dispatch('checkout/generateInvoice')
        $('#transparent-screen').hide()
        this.$store.commit('checkout/PAYMENT_MSG_STATUS', true)
        this.$store.dispatch('showMainCategory')
      }
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
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.smalldesc {
  max-height: 52px;
  overflow: hidden;
  transition: all 0.3s ease;
  &.expand {
    max-height: 450px;
  }
}
@include responsive(mobile) {
  #payment-msg {
    .modal-dialog {
      margin: 0;

      .modal-content {
        .modal-header {
          height: 50px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: none;
        }
      }
    }
  }
}
</style>
