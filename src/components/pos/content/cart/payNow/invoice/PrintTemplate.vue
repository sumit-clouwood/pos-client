<template>
  <Preloader v-if="dataBeingLoaded" />
  <div
    v-else
    :class="['invoice-body', template.rtl_supported ? 'rtl' : 'ltr']"
    :style="{ direction: template.rtl_supported ? 'rtl' : 'ltr' }"
  >
    <div class="header">
      <template v-if="template.show_logo">
        <img class="header-img" :src="company_logo" alt="Logo" />
      </template>
      <span v-if="template.use_default_header" v-html="default_header"> </span>
      <span v-else v-html="template.header"> </span>
    </div>
    <div class="main">
      <div class="main-title">{{ template.title_label }}</div>
      <div class="main-subtitle">
        {{ template.invoice_number_label }}
        {{ orderId ? orderId : order.real_created_datetime }}
      </div>
      <table class="print-invoice-table">
        <thead>
          <tr
            v-if="
              template.show_delivery_address &&
                customer &&
                order.order_delivery_area
            "
            class="full-width small-padding"
          >
            <td colspan="3">
              <div>
                {{ template.deliver_to_label }}
              </div>
              <div>
                <strong>{{ customer.name }}</strong>
              </div>
              <div>
                <strong>{{ customer.phone }}</strong>
              </div>
              <br />
              <div>
                {{ order.order_flat_number }} {{ order.order_building }}
              </div>
              <div>
                {{ order.order_street }} {{ order.order_nearest_landmark }}
              </div>
              <div>{{ get_delivery_area_name(order.order_delivery_area) }}</div>
            </td>
          </tr>
          <tr class="left-aligned">
            <th colspan="3">
              {{ template.order_type_label }}
              <span class="float-right">{{ order_type }}</span>
            </th>
          </tr>
          <tr v-if="crm_module_enabled && customer" class="left-aligned">
            <th colspan="3">
              {{ template.customer_label }}
              <span class="float-right">{{ customer.name }}</span>
            </th>
          </tr>
          <tr class="left-aligned">
            <th colspan="3">
              {{ template.staff_label }}
              <span class="float-right">{{ placed_by }}</span>
            </th>
          </tr>
          <tr class="left-aligned last-thead">
            <th colspan="3">
              {{ created_date }}
              <span class="float-right">{{ created_time }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-title">
            <th class="first-col">{{ template.qty_label }}</th>
            <th>{{ template.item_label }}</th>
            <th class="right-aligned">{{ template.amount_label }}</th>
          </tr>
          <template v-for="(item, key) in order.items">
            <tr :key="'item' + key">
              <td class="first-col">{{ item.qty }}</td>
              <td>
                <div class="food-title">
                  {{ translate_item(item) }}
                  <span
                    >({{
                      format_number(
                        parseFloat(item.price) + parseFloat(item.tax)
                      )
                    }})&#x200E;</span
                  >
                </div>
                <template v-for="(modifier, i) in order.item_modifiers">
                  <template v-if="modifier.for_item == item.no">
                    <div class="food-extra" :key="'modifier' + i">
                      {{ translate_item_modifier(modifier) }}
                      <span v-if="modifier.price !== 0"
                        >({{
                          format_number(
                            parseFloat(modifier.price) +
                              parseFloat(modifier.tax)
                          )
                        }}
                        x {{ modifier.qty }})&#x200E;</span
                      >
                      <span v-else-if="modifier.qty > 1"
                        >(x {{ modifier.qty }})&#x200E;</span
                      >
                    </div>
                  </template>
                </template>
              </td>
              <td class="right-aligned">
                {{ format_number(item_total(item.no)) }}
              </td>
            </tr>
            <tr
              v-for="(discount, key) in order.item_discounts"
              :key="'itemdiscount' + item.no + key"
              class="item-discount table-page-child"
            >
              <template v-if="discount.for_item == item.no">
                <td class="first-col table-page-child"></td>
                <td class="table-page-child">
                  <div class="food-extra">
                    {{ template.item_discount_label }}
                    <span>{{ translate_item_discount(discount) }}</span>
                  </div>
                </td>
                <td class="right-aligned table-page-child">
                  -{{ format_number(discount.price) }}
                </td>
              </template>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr
            v-if="template.show_order_notes && order.order_note"
            class="full-width padding-top"
          >
            <td colspan="3">
              {{ template.order_notes_label }}<br />{{ order.order_note }}
            </td>
          </tr>
          <template v-if="template.show_breakdown">
            <tr class="padding-top">
              <td colspan="2">
                {{ template.sub_total_label }}
              </td>
              <td class="right-aligned">
                {{ format_number(order.sub_total) }}
              </td>
            </tr>
            <tr
              v-for="(surcharge, key) in order.order_surcharges"
              :key="'surcharge' + key"
            >
              <td colspan="2">
                {{ translate_surcharge(surcharge) }}
              </td>
              <td class="right-aligned">
                {{ format_number(surcharge.price) }}
              </td>
            </tr>
            <tr
              v-for="(order_discount, key) in order.order_discounts"
              :key="'orderdiscount' + key"
            >
              <td colspan="2">
                {{ translate_order_discount(order_discount) }}
              </td>
              <td class="right-aligned">
                -{{ format_number(order_discount.price) }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                {{ template.tax_label }}
              </td>
              <td class="right-aligned">
                {{ format_number(order.total_tax) }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                {{ template.surcharge_tax_label }}
              </td>
              <td class="right-aligned">
                {{ format_number(order.surcharge_tax) }}
              </td>
            </tr>
            <tr class="important">
              <td colspan="3" class="footTotal">
                {{ template.total_label }}
                <span class="float-right">
                  {{ order.currency }} {{ format_number(order.balance_due) }}
                </span>
              </td>
            </tr>
            <tr
              v-for="(order_payment, key) in order.order_payments"
              :key="'payment' + key"
              class="footer-cash"
            >
              <td colspan="2">
                {{ translate_payment_type(order_payment) }}
                <span v-if="order_payment.param3"
                  >({{ template.card_label }} {{ order_payment.param3 }})</span
                >
              </td>
              <td class="right-aligned">
                {{ format_number(order_payment.collected) }}
              </td>
            </tr>
            <tr class="important">
              <td colspan="3" class="footTotal">
                <div>
                  {{ template.total_paid_label }}
                  <span class="float-right"
                    >{{ order.currency }}
                    {{ format_number(order.total_paid) }}</span
                  >
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                {{ template.tips_label }}
              </td>
              <td class="right-aligned">
                {{ format_number(order.tip_amount) }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                {{ template.changed_label }}
              </td>
              <td class="right-aligned">
                {{ format_number(order.amount_changed) }}
              </td>
            </tr>
            <tr
              v-for="(cards_with_point, key) in order.loyalty_cards_with_points"
              :key="'loyalty' + key"
            >
              <td colspan="2">
                {{ template.loyalty_points_earned_label }}
              </td>
              <td class="right-aligned">
                {{ format_number(cards_with_point.points) }}
              </td>
            </tr>
          </template>
        </tfoot>
      </table>
    </div>
    <div class="footer" v-html="template.footer"></div>
  </div>
</template>

<script>
import Preloader from '@/components/util/Preloader'
import { mapGetters, mapState } from 'vuex'
var moment = require('moment')
import DateTime from '@/mixins/DateTime'

export default {
  name: 'PrintTemplate',
  components: {
    Preloader,
  },
  mixins: [DateTime],
  data() {
    return {
      currentBrand: this.$store.state.location.brand,
      currentStore: this.$store.state.location.store,
      current_locale: this.$store.state.location.locale,
      // company_logo: this.$store.state.location.brand.company_logo,
      company_logo: '',
    }
  },
  mounted() {
    this.toDataURL(
      this.company_logo,
      base64 => {
        this.company_logo = base64
      },
      'image/png'
    )
  },
  props: ['template', 'order_to_print'],
  watch: {
    all_data_fully_loaded: function(new_value) {
      if (new_value == true) {
        this.$nextTick(() => this.$emit('print_ready'))
      }
    },
  },
  computed: {
    ...mapState('checkout', ['print']),
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['orderId']),
    ...mapState('location', ['timezoneString']),

    dataBeingLoaded() {
      if (!this.order_to_print || !this.template) {
        return true
      }
      return false
    },
    crm_module_enabled: function() {
      for (var module of this.currentBrand.enabled_modules) {
        //TODO - make constant
        if (module == 'CRM') {
          return true
        }
      }
      return false
    },
    active_store: function() {
      return this.currentStore
    },
    default_header: function() {
      if (this.active_store) {
        return `${this.currentBrand.name} <br/> ${this.active_store.city} ${
          this.template['branch_label']
        } <br/> ${this.template['telno_label']} ${this.active_store.phone}`
      } else {
        return ''
      }
    },

    current_time: function() {
      moment.locale(this.current_locale)
      return moment().local()
    },
    created_time() {
      if (this.order_to_print) {
        return this.convertDatetime(
          this.order.real_created_datetime,
          this.timezoneString,
          'h:mm:ss A'
        )
      }
      return this.current_time.format('h:mm A')
    },
    created_date() {
      if (this.order_to_print) {
        return this.convertDatetime(
          this.order.real_created_datetime,
          this.timezoneString,
          'Do MMMM YYYY'
        )
      }
      return this.current_time.format('Do MMMM YYYY')
    },
    placed_by: function() {
      return this.$store.state.location.userShortDetails.username
        ? this.$store.state.location.userShortDetails.username
        : this.$store.state.auth.userDetails.item.name
    },
    //If the customer is set in the order, we check if there is a property with customer info. If there is -
    // we output it. If there are no, we use sample customer. If customer is not set on the order -
    // that means there should be no customer in that order
    customer() {
      if (this.order) {
        if (this.$store.state.customer.offlineData) {
          return {
            name: this.$store.state.customer.offlineData.name,
            phone: this.$store.state.customer.offlineData.phone_number,
          }
        }
        if (this.order.customer) {
          return {
            name: this.$store.state.customer.customer.name,
            phone: this.$store.state.customer.customer.phone_number,
          }
        }
      }
      return null
    },
    order_type() {
      return this.template[this.order.order_type + '_label']
    },
    all_data_fully_loaded() {
      //these are needed at main app to trigger loads for collections in question
      if (this.order_to_print && this.template && this.print) {
        return true
      }
      return false
    },
    //This is a method to generate fake order for invoice generation. No need to have bottom part of it at the POS
    order() {
      if (this.dataBeingLoaded) {
        return null
      }
      return this.order_to_print
    },
  },
  methods: {
    is_ready_to_print() {
      if (this.all_data_fully_loaded) {
        return true
      }
      return false
    },
    format_number(number) {
      return parseFloat(number).toFixed(2)
    },
    translate_entity(entity, attribute) {
      var results = []
      for (var lng of this.template.languages) {
        if (
          entity['translations_dict'] &&
          entity['translations_dict'][attribute] &&
          entity['translations_dict'][attribute][lng]
        ) {
          results.push(entity['translations_dict'][attribute][lng])
        } else {
          results.push(entity[attribute])
        }
      }
      return results.join(' / ')
    },
    item_total(item_no) {
      var total = 0
      for (var item of this.order.items) {
        if (item.no == item_no) {
          total += (parseFloat(item.price) + parseFloat(item.tax)) * item.qty
        }
      }
      for (var modifier of this.order.item_modifiers) {
        if (modifier.for_item == item_no) {
          total +=
            (parseFloat(modifier.price) + parseFloat(modifier.tax)) *
            modifier.qty
        }
      }
      for (var item_discount of this.order.item_discounts) {
        if (item_discount.for_item == item_no) {
          total -= parseFloat(item_discount.price)
        }
      }
      return total
    },
    //These methods would need to be updated at POS to search for objects in POS store
    //These functions
    translate_item(orderItem) {
      var found_item = this.$store.state.category.items.find(
        item => item._id == orderItem.entity_id
      )
      if (found_item) {
        return this.translate_entity(found_item, 'name')
      } else {
        return ''
      }
    },
    translate_item_modifier(item) {
      var found_item = this.$store.getters['modifier/findModifier'](
        item.entity_id
      )
      if (found_item) {
        return this.translate_entity(found_item, 'name')
      } else {
        return ''
      }
    },
    translate_item_discount(item) {
      var found_item = this.$store.state.discount.itemDiscounts.data.find(
        loaded_item => loaded_item._id == item.entity_id
      )
      if (found_item) {
        return this.translate_entity(found_item, 'name')
      } else {
        return ''
      }
    },
    translate_surcharge(item) {
      var found_item = this.$store.state.surcharge.surcharges.find(
        loaded_item => loaded_item._id == item.entity_id
      )
      if (found_item) {
        return this.translate_entity(found_item, 'name')
      } else {
        return ''
      }
    },
    translate_order_discount(item) {
      var found_item = this.$store.state.discount.orderDiscounts.find(
        loaded_item => loaded_item._id == item.entity_id
      )
      if (found_item) {
        return this.translate_entity(found_item, 'name')
      } else {
        return ''
      }
    },
    translate_payment_type(item) {
      var found_item = this.$store.getters['payment/methods'].find(
        loaded_item => loaded_item._id == item.entity_id
      )
      if (found_item) {
        return this.translate_entity(found_item, 'name')
      } else {
        return ''
      }
    },
    get_delivery_area_name(delivery_area_id) {
      var found = this.$store.state.customer.fetchDeliveryAreas.find(
        item => item._id == delivery_area_id
      )
      if (found) {
        return found.text
      }
    },
    toDataURL(src, callback, outputFormat) {
      var img = new Image()
      img.crossOrigin = 'Anonymous'

      img.src = src
      if (img.complete || img.complete === undefined) {
        img.src =
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
        img.src = src
      }

      img.onload = function() {
        var canvas = document.createElement('CANVAS')
        var ctx = canvas.getContext('2d')
        var dataURL
        canvas.height = this.naturalHeight
        canvas.width = this.naturalWidth
        ctx.drawImage(this, 0, 0)
        dataURL = canvas.toDataURL(outputFormat)
        callback(dataURL)
      }
    },
  },
}
</script>
