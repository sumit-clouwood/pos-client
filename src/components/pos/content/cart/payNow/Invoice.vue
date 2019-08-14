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
            //2. to print in new window
            console.log('printing iframe')
            // const w = window.open()
            // w.document.write(this.iframe_body)
            // w.print()
            // w.close()

            //1. print in iframe
            this.$refs.iframe.contentWindow.print()
            //this.$refs.iframe.contentWindow.print()
          } catch (e) {
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
      var body = `<html><head><title>${
        this.order_title
      }</title><style lang="css" scoped>
          .invoice-body {
              overflow-y: auto;
              height: 100%;
              width: 100%;
              padding: 1.25em;
              margin: 0px;
              font-family: 'Roboto', sans-serif;
              color: #000;
              box-sizing: border-box;
              font-size: 11px;
          }

          .invoice-body .loading {
              padding: 05em;
          }


          .invoice-body * {
              font-family: 'Roboto', sans-serif;
              font-size: 1em;
              line-height: normal;
          }

          .invoice-body table {
              border-collapse: collapse;
              width: 100%;
          }

          .invoice-body thead {

          }

          .invoice-body tfoot tr.first-col {
              border-top: 2px solid #666;
              margin-top: 0.3em;
              padding: 0.3em 0;
          }


          .invoice-body tr th {
              word-break: normal;
          }

          .invoice-body tr td.right-aligned, .invoice-body tr th.right-aligned {
              text-align: right;
          }

          .invoice-body.rtl tr td.right-aligned, .invoice-body.rtl tr th.right-aligned {
              text-align: left;
          }

          .invoice-body tr td.first-col {
              width: 20%;
              min-width: 20%;
          }

          .invoice-body tr.full-width td {
              text-align: center;
              width: 100%;
          }

          .invoice-body tr.full-width {
              justify-content: center;
          }

          .invoice-body tr.important td {
              border-bottom: 1px solid #666;
              border-top: 1px solid #666;
              padding-bottom: 0.6em;
              padding-top: 0.6em;
          }

          .invoice-body tr.small-padding td {

              padding-bottom: 0.4em;
              padding-top: 0.4em;

          }

          .invoice-body tbody td:nth-child(2) {
              /*flex-grow: 1;
              flex-shrink:100;*/
          }

          .invoice-body tbody {
              border-bottom: 1px solid #666;
          }

          .invoice-body tbody tr td {
              padding-top: 0.3em;
              margin-top: 0.3em;
          }

          .invoice-body tbody tr.item-discount {
              border-top: unset;
              padding-top: 0;
              margin-top: 0;
          }

          .invoice-body tbody tr.item-discount td {
              padding-top: 0;
              margin-top: 0;
          }

          .invoice-body tbody tr:first-child {
              border: none;
          }


          .invoice-body .table-title {
              margin-top: 0.8em;
          }

          .invoice-body .table-title th {
              border-top: 2px solid #666;
              border-bottom: 2px solid #666;

          }

          .invoice-body .table-title th {
              padding: 0.3em;
              margin: 0.3em;
          }

          .invoice-body .table-title th:nth-child(1) {
              width: 20%;
              min-width: 20%;
              text-align: left;
          }

          .invoice-body.rtl td {
              text-align: right;
          }


          .invoice-body.rtl .table-title th:nth-child(1) {
              text-align: right;
          }

          .invoice-body.rtl .float-left {
              float: right !important;
          }

          .invoice-body.rtl .float-right {
              float: left !important;
          }

          .invoice-body .food-title {
              font-weight: 500;
          }

          .invoice-body .food-extra {
              font-style: italic;
              font-size: 1em;
          }

          .invoice-body .header {
              border-bottom: 1px solid #666;
              display: grid;
              justify-content: center;
              text-align: center;
              padding: 0 0 1.25em 0;
              font-size: 1.1em;
          }

          .invoice-body .header p {
              margin-top: 1em;
              margin-bottom: 1em;
          }

          .invoice-body .header-img {
              width: 50%;
              min-width: 50%;
              display: inline-block;
              margin: 0 auto 1.2em;
          }

          .invoice-body .main {
              display: block;
          }

          .invoice-body .main-title {
              text-align: center;
              font-weight: 700;
              padding: 0.3em 0;
              border-bottom: 1px solid #666;
              font-size: 2em;
          }

          .invoice-body .main-subtitle {
              text-align: center;
              font-weight: 700;
              padding: 0.6em;
              font-size: 1.4em;
          }

          .invoice-body .footer {
              display: grid;
              padding: 1.25em 0;
              text-align: center;
              font-size: 1.2em;
          }

          .invoice-body .last-thead th {
              padding-bottom: 0.6em;
          }

          .invoice-body .footTotal {
              font-weight: 900;
          }

          .invoice-body tr.padding-top td {

              padding-top: 0.8em;
          }

          .invoice-body .foot-cash {
              font-weight: 900;
              font-size: 1.25em;
          }

          .invoice-body .left-aligned {
              text-align: left;
          }

          .invoice-body.rtl .left-aligned {
              text-align: right;
          }

          .float-right {
              float: right
          }

          .invoice-body.rtl .float-right {
              float: left;
          }

          .invoice-body tr td {
              page-break-inside: avoid;
              font-size: 1em;
          }

          .invoice-body table tfoot {
              display: table-row-group;
          }

          .invoice-body table thead {
              display: table-row-group;
          }

        </style></head><body style="width:100%">${
        this.invoiceHtml
      }</body></html>`
      this.iframe_body = body
      //1. to print in new window
      //this.doPrint()
    },
  },
}
</script>
<style scoped>
.invoice {
  display: none;
}
</style>
