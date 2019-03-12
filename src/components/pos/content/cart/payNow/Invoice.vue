<!-- language show_price show_modifier_items                                                                                                                                                                                   show_modifier_notes show_combo_items
    show_order_notes show_breakdown sub_total_label tax_label to_pay_label
    -->

<template>
  <div class="invoice" id="printarea" v-if="print">
    <WalkinInvoice v-if="order.order_type == 'Walk-in'" />
    <!-- <div
      v-if="tpl && tpl.foreignLang && tpl.template.language != 'en_US'"
    ></div> -->
  </div>
</template>

<script>
/* global $ hidePayNow */
import { mapState } from 'vuex'
import WalkinInvoice from './invoice/WalkinInvoice'
export default {
  name: 'Invoice',
  props: {},
  computed: {
    ...mapState('checkout', ['print', 'order']),
  },
  components: {
    WalkinInvoice,
  },
  updated() {
    if (this.$store.state.checkout.print) {
      const w = window.open()

      const styles = `.invoice {
        padding : 10px;
      }
      .left, .right {
        display : inline-block;
        width: 50%
      }

      .right {
        text-align:right !important;
      }

      .right div {
          text-align:right !important;
      }
      .text-center {
        text-align : center;
      }
      .text-left { text-align : left; }
      .text-right {
        text-align : right
      }`

      w.document.write('<style>' + styles + '</style>' + $('#printarea').html())
      w.print()
      w.close()

      //becareful for circular dependency
      this.$store.dispatch('checkout/reset')
      //this.$store.commit('checkout/PRINT', false)
      $('.modal-backdrop').remove()
      hidePayNow()
    }
  },
}
</script>
