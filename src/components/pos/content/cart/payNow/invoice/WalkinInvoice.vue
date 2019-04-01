<template>
  <div v-if="tpl">
    <div v-if="tpl.template.show_logo"><img :src="logo" /></div>
    <div
      v-if="tpl.template.show_header"
      class="text-center"
      v-html="tpl.template.invoice_header"
    ></div>
    <hr />
    <h2 class="text-center">{{ labels.title_label }}</h2>
    <hr />

    <div class="text-center">
      {{ labels.invoice_number_label }} {{ orderNumber }}
    </div>

    <DeliveryAddress v-if="tpl.template.show_delivery_address" />

    <div>
      <div class="left">
        <div class="staff-name">
          <div>{{ labels.order_type_label }}</div>
          <div>{{ labels.staff_label }}</div>
          <div>{{ order.created_date }}</div>
        </div>
      </div>
      <div class="right">
        <div>{{ order.order_type }}</div>
        <div>{{ username }}</div>
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
      :items="order.itemData"
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
      <div>
        <span class="left">{{ labels.surcharge_label }} </span>
        <span class="right"> {{ formatPrice(order.surcharge) }}</span>
      </div>
      <div>
        <span class="left">{{ labels.discount_label }} : </span>
        <span class="right"> {{ formatPrice(order.discount_amount) }}</span>
      </div>
      <div>
        <span class="left">{{ labels.to_pay_label }} : </span>
        <span class="right"> {{ formatPrice(payableAmount) }}</span>
      </div>
      <PaymentBreakdown :payments="order.payBreakDown" />
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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import DeliveryAddress from './DeliveryAddress'
import PaymentBreakdown from './PaymentBreakdown'
import Items from './Items'
export default {
  name: 'WalkinInvoice',
  props: {},
  computed: {
    ...mapState('checkout', [
      'order',
      'payableAmount',
      'paidAmount',
      'orderNumber',
    ]),
    ...mapGetters('invoice', ['tpl', 'logo']),
    ...mapGetters('location', ['formatPrice']),
    ...mapGetters('customer', ['selectedAddress', 'customer']),
    ...mapState({
      username: state =>
        state.auth.userDetails ? state.auth.userDetails.name : '',
    }),

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
  components: {
    DeliveryAddress,
    PaymentBreakdown,
    Items,
  },
}
</script>
