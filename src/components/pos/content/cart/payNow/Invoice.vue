<template>
  <div class="invoice" id="printarea">
    <div v-show="print">
      <PrintTemplate
        ref="print_template"
        :template="template"
        :order_to_print="order"
        :order_id="orderId"
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
      if (this.print && this.iframe_body) {
        this.$nextTick(() => {
          this.$refs.iframe.contentWindow.print()
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
        })
      }
    },
    print_ready() {
      var body = `<html><head><link rel="stylesheet" href="http://localhost:8080/css/print_invoice.css"/><title>${
        this.order_title
      }</title></head><body style="width:100%">${
        this.$refs.print_template.$el.outerHTML
      }</body></html>`
      this.iframe_body = body
    },
  },
  watch: {
    print(newVal) {
      if (newVal) {
        //this.$emit('print_ready')
        this.print_ready()
        if (this.$store.state.order.orderType.OTApi === 'call_center') {
          this.$router.replace({ name: 'DeliveryManager' })
          // window.location = process.env.VUE_APP_DELIVERY_MANAGER_URL.replace(
          //   '{brand_id}',
          //   this.$store.state.context.brandId
          // )
        }
      }
    },
  },
}
</script>
<style scoped>
.invoice {
  display: none;
}
</style>
