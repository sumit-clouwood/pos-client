<template>
  <div class="invoice" id="printarea">
    <div v-show="print">
      <PrintTemplate
        ref="print_template"
        :template="template"
        :order_to_print="order"
        @print_ready="print_ready"
      ></PrintTemplate>
    </div>

    <iframe
      id="print-iframe"
      ref="iframe"
      width="100%"
      frameborder="0"
      @load="doPrint"
      :srcdoc="iframe_body"
    ></iframe>

    <link rel="prefetch" href="css/print_invoice.css" />
  </div>
</template>

<script>
/* global $ hidePayNow */
/* eslint-disable no-console */
import { mapState, mapGetters } from 'vuex'
import PrintTemplate from './invoice/PrintTemplate'

export default {
  name: 'Invoice',
  props: {},
  data() {
    return {
      iframe_body: null,
      invoiceHtml: null,
    }
  },
  components: {
    PrintTemplate,
  },
  computed: {
    ...mapState('checkout', ['print', 'order']),
    ...mapState('order', ['orderId']),
    ...mapState('context', ['brandId']),
    ...mapGetters('invoice', ['template']),
    ...mapGetters('location', ['_t']),
    order_title() {
      return (
        this._t('ORDER_DIALOG_TITLE_PREFIX') +
        (this.orderId ? this.orderId : this.order.real_created_datetime) +
        this._t('ORDER_DIALOG_TITLE_SUFFIX') +
        this.order.order_mode
      )
    },
  },

  methods: {
    doPrint() {
      console.log('iframe laoded, do print called')
      this.$nextTick(() => {
        console.log('iframe laoded, do print called, next tick called')
        console.log('print', this.print)
        if (this.print && this.iframe_body) {
          console.log('print singal received')
          this.$store.commit('checkout/PRINT', false)

          try {
            console.log('printing iframe')
            this.$refs.iframe.contentWindow.print()
          } catch (e) {
            document.getElementById('print-iframe').contentWindow.print()

            console.log('print ifrmae error orccured')
            console.log(e)
          }

          this.$store.dispatch('checkout/reset')

          $('.modal-backdrop').remove()
          $('#order-confirmation').hide()
          hidePayNow()

          if (this.$store.state.order.orderType.OTApi === 'call_center') {
            this.$router.replace({ name: 'DeliveryManager' })
          }
        }
      })
    },
    print_ready() {
      console.log(this.print)
      this.invoiceHtml = this.$refs.print_template.$el.outerHTML
      console.log('in print ready html length', this.invoiceHtml.length)
      var body = `<html><head><link rel="stylesheet" href="css/print_invoice.css"/><title>${
        this.order_title
      }</title></head><body style="width:100%">${
        this.invoiceHtml
      }</body></html>`
      this.iframe_body = body
    },
  },
}
</script>
<style scoped>
.invoice {
  display: none;
}
</style>
