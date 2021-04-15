<template>
  <div class="invoice" id="printarea">
    <div v-show="print">
      <PrintTemplate
        ref="print_template"
        :template="template"
        :order_to_print="order"
        @print_ready="print_ready"
        :preview="preview"
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
import * as CONST from '@/constants'

export default {
  name: 'Invoice',
  props: {},
  data() {
    return {
      iframe_body: null,
      invoiceHtml: null,
      isPrint: false,
    }
  },
  components: {
    PrintTemplate,
  },
  computed: {
    ...mapState('checkout', [
      'print',
      'order',
      'changedAmount',
      'changeAmountStatus',
      'paymentMsgStatus',
      'paymentAction',
    ]),
    ...mapState('context', ['brandId']),
    ...mapGetters('invoice', ['template']),
    ...mapGetters('location', ['_t']),
    order_title() {
      if (this.preview) {
        return ''
      }
      return (
        this._t('ORDER_DIALOG_TITLE_PREFIX') +
        (this.order.order_no
          ? this.order.order_no
          : this.order.real_created_datetime
          ? this.order.real_created_datetime
          : '') +
        this._t('ORDER_DIALOG_TITLE_SUFFIX') +
        this.order.order_mode
      )
    },
    preview() {
      if (this.paymentAction === 'dine-in-order-preview') {
        return true
      }
      return false
    },
  },
  watch: {
    paymentMsgStatus(newVal) {
      if (newVal && this.$store.getters['checkout/complete']) {
        //if (newVal) {
        this.postRedirect()
        this.$store.commit('checkout/PAYMENT_MSG_STATUS', false)
      } else {
        this.postRedirectIncomplete()
      }
    },
    changeAmountStatus(newVal) {
      if (newVal && this.$store.getters['checkout/complete']) {
        //if (newVal) {
        //Reset Cart and set states and redirect to dine in.
        this.postRedirect()
        this.$store.commit('checkout/CHANGE_AMOUNT_STATUS', false)
      } else {
        this.postRedirectIncomplete()
      }
    },
  },
  methods: {
    postRedirectIncomplete() {},
    postRedirect() {
      if (this.$store.state.order.orderType.OTApi === 'dine_in') {
        this.$store.dispatch('order/beforeRedirectResetCartDineIn')
        this.$router.replace({ name: 'Dinein' })
      } else if (this.$store.state.order.orderType.OTApi === 'call_center') {
        this.$router.replace({ name: 'DeliveryManager' })
      } else if (this.isPrint) {
        this.isPrint = false
      }
      if (this.$store.state.order.orderType.OTApi === CONST.ORDER_TYPE_CARHOP) {
        this.$router.replace({ name: 'CarhopOrders' })
      }
      this.$store.commit('order/RESET_SPLIT_BILL')
    },
    doPrint() {
      let orderData = this.order
      if (this.print && this.iframe_body) {
        this.$store.commit('checkout/PRINT', false)
        this.isPrint = true
        try {
          setTimeout(() => {
            if (window.PrintHandle == null) {
              //this.$refs.iframe.contentWindow.print()
              let w = this.$refs.iframe.contentWindow
              w.focus()
              w.print()
              this.iframe_body = ''
            }
            // Code Pane reflects in DIMS WEB APP window.PrintHandle.GetAgent() !== 'Dimspos.App'
            // if (!this.$store.getters['checkout/complete']) {
            //   this.$store.dispatch('checkout/splitOrder').then(() => {})
            // }
            if (
              !['dine-in-order-preview'].includes(this.paymentAction) ||
              this.$store.state.auth.deviceType.osType
            ) {
              this.$store.dispatch(
                'printingServer/printingServerInvoiceRaw',
                orderData
              )
            }
          }, 500)
          //this.$refs.iframe.contentWindow.print()
        } catch (e) {
          // eslint-disable-next-line
          console.log('print iframe error occurred')
          console.log(e)
        }
        let resetFull = false
        if (this.$store.getters['checkout/complete']) {
          resetFull = true
          this.$store.commit('order/CLEAR_SELECTED_ORDER')
        }

        this.$store.dispatch('checkout/reset', resetFull)

        $('.modal-backdrop').remove()
        $('#order-confirmation').hide()
        hidePayNow()
      }
    },
    print_ready() {
      this.invoiceHtml = this.$refs.print_template.$el.outerHTML
      //console.log('in print ready html length', this.invoiceHtml.length)
      var body = `<html><head><title>${this.order_title}</title><style lang="css" scoped>
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
          .invoice-body .combo-items {
              font-weight: 500;
              padding-left:1em;
          }

          .invoice-body .combo-items-extra {
              font-style: italic;
              font-size: 1em;
              padding-left:1.5em;
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

          .invoice-body tr.spacer p {
            height:7px; 
            margin:0;
            padding:0;
          }
          .invoice-body tr th {
              word-break: normal;
              text-align: left;
          }
           .invoice-body tr td {
             }

          .invoice-body tr td.right-aligned, .invoice-body tr th.right-aligned {
              text-align: right;
          }

          .invoice-body.rtl tr td.right-aligned, .invoice-body.rtl tr th.right-aligned {
              text-align: left;
          }

          .invoice-body tr td.first-col {
              width: 7%;
              min-width: 7%;
          }
          
          .invoice-body tr th.serial {
              width: 7%;
              min-width: 7%;
          }
          .invoice-body tr td.serial {
              width: 7%;
              min-width: 7%;
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

          .invoice-body tbody td:nth-child(3) {
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

          .invoice-body .table-title th:nth-child(2) {
              width: 7%;
              min-width: 7%;
              text-align: left;
          }

          .invoice-body.rtl td {
              text-align: right;
          }


          .invoice-body.rtl .table-title th:nth-child(2) {
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
              margin-top: 0;
              margin-bottom: 0;
          }

          .invoice-body .header-img {
              max-height: 180px !important;
              min-height: 120px !important;
              max-width: 96%;
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

        </style></head><body style="width:100%">${this.invoiceHtml}</body></html>`
      localStorage.setItem('placedOrderData', body.toString()) //This localstorage variable hold invoice data for IOS Webviews. IOS Webviews does not display default Browser Print Window.
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
