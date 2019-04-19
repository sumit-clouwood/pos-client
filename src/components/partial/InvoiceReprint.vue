<template>
    <div class="invoice" id="printarea" v-if="print">
        <div v-if="tpl">
            <div v-if="tpl.template.show_logo">
                <img :src="logo" /></div>
                <div
                        v-if="tpl.template.show_header"
                        class="text-center"
                        v-html="tpl.template.invoice_header"
                >
                <hr />
            </div>

            <h2 class="text-center">{{ labels.title_label }}</h2>
            <hr />

            <div class="text-center">
                {{ labels.invoice_number_label }} {{ order.order_no }}
            </div>

            <DeliveryAddress v-if="order.delivery_area" :deliveryAddress="order" />

            <div>
                <div class="left">
                    <div class="staff-name">
                        <div>{{ labels.order_type_label }}</div>
                        <div>{{ labels.staff_label }}</div>
                        <div>{{ order.created_date }}</div>
                    </div>
                </div>
                <div class="right">
                    <div style="text-transform:capitalize">{{ order.order_type }}</div>
                    <div>{{ order.created_by }}</div>
                    <div>{{ order.created_time }}</div>
                </div>
            </div>
            <hr />
            <Items
                    :labels="{
        qty_label: labels.qty_label,
        item_label: labels.item_label,
        price_label: labels.price_label,
      }"
                    :itemsDetails="order.items"
                    :tpl="tpl"
            />
            <hr />
            <div class="totals">
                <div>
                    <span class="left">{{ labels.sub_total_label }}</span>
                    <span class="right"> {{ formatPrice(order.subtotal) }}</span>
                </div>
                <div>
                    <span class="left">{{ labels.tax_label }} </span>
                    <span class="right"> {{ formatPrice(order.final_tax) }}</span>
                </div>
                <div v-if="formatPrice(order.surcharge) > 0">
                    <span class="left">{{ labels.surcharge_label }} </span>
                    <span class="right"> {{ formatPrice(order.surcharge) }}</span>
                </div>
                <div v-if="formatPrice(order.discount_amount) > 0">
                    <span class="left">{{ labels.discount_label }} : </span>
                    <span class="right"> {{ formatPrice(order.discount_amount) }}</span>
                </div>
                <div>
                    <span class="left">{{ labels.to_pay_label }} : </span>
                    <span class="right"> {{ formatPrice(order.balance_due) }}</span>
                </div>
                <PaymentBreakdown :payments="order.payment_info" :referral="order.referral" />
                <!-- <div>
                    <span class="left">{{ tpl.template.received_label }} :</span>
                    <span class="right"> {{ formatPrice(paidAmount) }}</span>
                  </div> -->
                <div>
                    <span class="left">{{ labels.exchange_label }} </span>
                    <span class="right"> {{ formatPrice(order.amount_changed) }}</span>
                </div>
            </div>
            <hr />
            <div
                    v-if="tpl.template.show_footer"
                    class="text-center"
                    v-html="tpl.template.invoice_footer"
            ></div>
            <div v-else class="text-center">
                Thank You For Order <br >
                <b>Visit Again</b>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ hidePayNow */

import { mapState, mapGetters } from 'vuex'
import DeliveryAddress from './invoice/DeliveryAddress'
import PaymentBreakdown from './invoice/PaymentBreakdown'
import Items from './invoice/Items'

export default {
  name: 'InvoiceReprint',
  props: {
    order: Object
  },
  computed: {
    /*...mapState('checkout', [
        'order',
        'payableAmount',
        'paidAmount',
        'orderNumber',
      ]),*/
    // ...mapGetters('order', ['orderTotal', 'subTotal']),
    ...mapState('checkout', ['print']),
    ...mapGetters('invoice', ['tpl', 'logo']),
    ...mapGetters('location', ['formatPrice']),
    /*...mapGetters('customer', ['selectedAddress', 'customer']),
      ...mapState({
        username: state =>
          state.auth.userDetails ? state.auth.userDetails.name : '',
      }),*/
    labels: function() {
      const tpl = this.$store.getters['invoice/tpl']
      let labels = {
        title_label: tpl.en.title_label,
        invoice_number_label: tpl.en.invoice_number_label,
        order_type_label: tpl.en.order_type_label || 'Order Type',
        staff_label: tpl.en.staff_label || 'Staff',
        sub_total_label: tpl.en.sub_total_label,
        tax_label: tpl.en.tax_label,
        surcharge_label: tpl.en.surcharge_label,
        discount_label: tpl.en.discount_label,
        to_pay_label: tpl.en.to_pay_label,
        exchange_label: tpl.en.exchange_label,
        qty_label: tpl.en.qty_label,
        item_label: tpl.en.item_label,
        price_label: tpl.en.price_label,
      }

      //populate defaults
      Object.keys(labels).map(function(key) {
        if (!labels[key]) {
          labels[key] = tpl.defaultTemplate[key]
        }
      })

      if (tpl.foreignLang && tpl.template.language != 'en_US') {
        //provide dual lang

        Object.keys(labels).map(function(key) {
          if (tpl.template[key]) {
            labels[key] = labels[key] + ' / ' + tpl.template[key]
          }
        })
      }

      return labels
    },
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
      // w.print()
      // w.close()

      //becareful for circular dependency
      this.$store.dispatch('checkout/reset')
      this.$store.commit('checkout/PRINT', false)

      if (this.$store.state.order.orderType === 'delivery') {
        this.$router.replace({ name: 'DeliveryManager' })
      }
      $('.modal-backdrop').remove()
      hidePayNow()
    }
  },

  components: {
    DeliveryAddress,
    PaymentBreakdown,
    Items,
  },
}
</script>
