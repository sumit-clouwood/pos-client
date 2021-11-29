<template>
  <Preloader v-if="dataBeingLoaded" />
  <div
    v-else
    :class="['invoice-body', template.rtl_supported ? 'rtl' : 'ltr']"
    :style="{ direction: template.rtl_supported ? 'rtl' : 'ltr' }"
  >
    <div class="header">
      <div
        v-if="
          isTokenManager &&
            tokenNumber &&
            (orderType.OTApi === 'walk_in' || orderType.OTApi === 'carhop')
        "
        style="text-align: center;font-weight: 700;
            padding: 0 0 0.3em 0;font-size: 3em;"
      >
        <div style="  font-size: 0.3em;font-weight: normal;">
          {{ template.token_number_label }}
        </div>
        {{ tokenNumber }}
      </div>

      <template v-if="template.show_logo">
        <img class="header-img" :src="company_logo" alt="Logo" />
      </template>
      <span v-if="template.use_default_header" v-html="default_header"> </span>
      <span v-else v-html="template.header"> </span>
    </div>
    <div class="main">
      <div class="main-title">{{ template.title_label }}</div>
      <div v-if="storeOrderNoInfo && !preview" class="main-subtitle">
        <div>
          {{ template.invoice_number_label }}
          {{ storeOrderNoInfo }}
        </div>
        <div class="brand_ref_invoice_no">
          <span
            >{{
              storeOrderNoInfo
                ? _t('Brand Ref')
                : template.invoice_number_label
            }}: {{ getPrintDataTime }}</span
          >
        </div>
      </div>
      <div class="main-subtitle" v-else>
        {{ template.invoice_number_label }}
        {{ getPrintDataTime }}
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
            <td :colspan="colspanFull">
              <div>
                {{ template.deliver_to_label }}
              </div>
              <div>
                {{ order.order_flat_number }} {{ order.order_building }}
              </div>
              <div>
                {{ order.order_street }} {{ order.order_nearest_landmark }}
              </div>
              <div>
                <span>{{ getDeliveryArea(order.order_delivery_area) }}</span>
              </div>
            </td>
          </tr>
          <tr class="left-aligned">
            <th :colspan="colspanFull">
              {{ template.order_type_label }}
              <span class="float-right">{{ order_type }}</span>
            </th>
          </tr>
          <tr
            class="left-aligned"
            v-if="selectedTableRservationData && orderType.OTApi === 'dine_in'"
          >
            <th :colspan="colspanFull">
              {{ template.table_number_label }}
              <span class="float-right">
                {{ selectedTableRservationData }}
              </span>
            </th>
          </tr>
          <tr v-if="customer" class="left-aligned">
            <th :colspan="colspanFull">
              {{ template.customer_label }}
              <span class="float-right">{{ customer.name }}</span>
            </th>
          </tr>
          <tr v-if="customer" class="left-aligned">
            <th :colspan="colspanFull">
              {{ _t('Contact') }}
              <span class="float-right">{{ customer.phone }}</span>
            </th>
          </tr>
          <tr class="left-aligned">
            <th :colspan="colspanFull">
              {{ template.staff_label }}
              <span class="float-right">{{ placed_by }}</span>
            </th>
          </tr>
          <tr class="left-aligned last-thead">
            <th :colspan="colspanFull">
              {{ created_date }}
              <span class="float-right">{{ created_time }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-title">
            <th class="first-col serial" v-if="showNumbering" valign="top">
              #
            </th>
            <th class="first-col qty">{{ template.qty_label }}</th>
            <th class="item-name">{{ template.item_label }}</th>
            <th class="right-aligned">{{ template.amount_label }}</th>
          </tr>
          <tr :key="'spacer'" class="spacer">
            <td :colspan="colspanFull"><p>&nbsp;</p></td>
          </tr>
          <template v-for="(item, key) in order.items">
            <tr v-if="item.type == 'combo_item'" :key="key">
              <td class="first-col serial" v-if="showNumbering" valign="top">
                {{ key + 1 }}
              </td>
              <td class="first-col qty" valign="top">
                {{ qtyString(item) }} {{ measurement_unit(item) }}
              </td>
              <td class="item-name">
                <div class="food-title">
                  {{ translate_item(item) }}
                  <span
                    >({{ format_number(item_gross_price(item)) }})&#x200E;</span
                  >
                </div>
                <template v-for="(combo_item, i) in order.items">
                  <template v-if="combo_item.for_combo === item.no">
                    <div class="combo-items" :key="i">
                      {{ combo_item.qty }} {{ translate_item(combo_item) }}
                    </div>
                    <template v-for="(modifier, i) in order.item_modifiers">
                      <template v-if="modifier.for_item == combo_item.no">
                        <div class="combo-items-extra" :key="i + 100">
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
                  </template>
                </template>
              </td>
              <td class="right-aligned" valign="top">
                {{ format_number(combo_item_total(item.no)) }}
              </td>
            </tr>
            <tr
              v-if="
                item.type != 'combo_item' &&
                  (item.for_combo === false || item.for_combo == null)
              "
              :key="'item' + key"
            >
              <td class="serial" valign="top" v-if="showNumbering">
                {{ key + 1 }}
              </td>
              <td class="first-col qty" valign="top">
                {{ qtyString(item) }} {{ measurement_unit(item) }}
              </td>
              <td class="item-name">
                <div class="food-title">
                  {{ translate_item(item) }}
                  <span
                    >({{ format_number(item_gross_price(item)) }})&#x200E;</span
                  >
                </div>
                <template v-for="(modifier, i) in order.item_modifiers">
                  <template v-if="modifier.for_item == item.no">
                    <div class="food-extra" :key="'modifier' + i">
                      {{ translate_item_modifier(modifier, item) }}
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
              <td class="right-aligned" valign="top">
                {{ format_number(item_total(item.no)) }}
              </td>
            </tr>
            <tr
              v-if="showBarcode && item.barcode"
              :key="'barcode' + item.no + key"
            >
              <td v-if="showNumbering"></td>
              <td></td>
              <td>
                <div>{{ _t('Barcode') }} {{ item.barcode }}</div>
              </td>

              <td></td>
            </tr>
            <tr
              v-for="(discount, key) in order.item_discounts"
              :key="'itemdiscount' + item.no + key"
              class="item-discount table-page-child"
            >
              <template v-if="discount.for_item == item.no">
                <td
                  class="first-col table-page-child"
                  v-if="showNumbering"
                ></td>
                <td class="first-col table-page-child"></td>
                <td class="table-page-child">
                  <div class="food-extra">
                    {{ template.item_discount_label }}
                    <span>{{ translate_item_discount(discount) }}</span>
                  </div>
                </td>
                <td class="right-aligned table-page-child" valign="top">
                  -{{ format_number(discount_total(discount)) }}
                </td>
              </template>
            </tr>
            <tr :key="'note' + key" v-if="item.note">
              <td class="first-col table-page-child" v-if="showNumbering"></td>
              <td class="first-col table-page-child"></td>
              <td class="table-page-child">
                <span class="food-title">{{ _t('Note') }}: </span>
                <i>{{ item.note }}</i>
              </td>
              <td class="right-aligned table-page-child"></td>
            </tr>
            <tr
              v-if="item.for_combo === false"
              :key="'spacer' + key"
              class="spacer"
            >
              <td :colspan="colspanFull"><p>&nbsp;</p></td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr
            v-if="template.show_order_notes && order.order_note"
            class="full-width padding-top"
          >
            <td :colspan="colspanFull">
              {{ template.order_notes_label }}<br />{{ order.order_note }}
            </td>
          </tr>
          <template v-if="template.show_breakdown">
            <tr class="padding-top">
              <td :colspan="colspanFirst">
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
              <td :colspan="colspanFirst">
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
              <td :colspan="colspanFirst">
                {{ translate_order_discount(order_discount) }}
              </td>
              <td class="right-aligned">
                -{{ format_number(order_discount.price) }}
              </td>
            </tr>
            <tr>
              <td :colspan="colspanFirst">
                {{ template.tax_label }}
              </td>
              <td class="right-aligned">
                {{ format_number(order.total_tax) }}
              </td>
            </tr>
            <tr v-if="parseFloat(order.delivery_surcharge) > 0">
              <td :colspan="colspanFirst">
                {{ _t('Delivery Surcharge') }}
              </td>
              <td class="right-aligned">
                {{ format_number(order.delivery_surcharge) }}
              </td>
            </tr>
            <tr class="important">
              <td :colspan="colspanFull" class="footTotal">
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
              <td :colspan="colspanFirst">
                {{ translate_payment_type(order_payment) }}
                <span v-if="order_payment.param3"
                  >({{ template.card_label }} {{ order_payment.param3 }})</span
                >
              </td>
              <td class="right-aligned">
                {{ format_number(order_payment.collected) }}
              </td>
            </tr>
            <tr
              class="important"
              v-if="
                !preview && order.order_type !== CONST.ORDER_TYPE_CALL_CENTER
              "
            >
              <td :colspan="colspanFull" class="footTotal">
                <div>
                  {{ template.total_paid_label }}
                  <span class="float-right"
                    >{{ order.currency }}
                    {{ format_number(order.total_paid) }}</span
                  >
                </div>
              </td>
            </tr>
            <tr
              class="important"
              v-if="order.order_type === CONST.ORDER_TYPE_CALL_CENTER"
            >
              <td :colspan="colspanFull" class="footTotal">
                {{ referral_data(order.referral) }}
                {{
                  referral.referral_type === CONST.REFERRAL_TYPE_COD
                    ? 'Cash on Delivery'
                    : 'Paid by ' + referral.name
                }}
                <!--Paid by {{ getReferral(order.referral).name }} {{ referral }}-->
              </td>
            </tr>
            <tr
              v-if="
                !preview && order.order_type !== CONST.ORDER_TYPE_CALL_CENTER
              "
            >
              <td :colspan="colspanFirst">
                {{ template.tips_label }}
              </td>
              <td class="right-aligned">
                {{ format_number(order.tip_amount) }}
              </td>
            </tr>
            <tr
              v-if="
                !preview && order.order_type !== CONST.ORDER_TYPE_CALL_CENTER
              "
            >
              <td :colspan="colspanFirst">
                {{ template.changed_label }}
              </td>
              <td class="right-aligned">
                {{ format_number(order.amount_changed) }}
              </td>
            </tr>
            <tr
              v-for="(cards_with_point, key) in order.loaylty_earn_points"
              :key="'loyalty' + key"
            >
              <td :colspan="colspanFirst">
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
    <div class="footer">
      <div v-html="template.footer"></div>
      <div v-if="currentBrand.is_store_order_number && isOrderPaidOrNot">
        <div
          id="qrcode"
          style="width:140px; height:140px; margin:0 auto; overflow: hidden"
        >
          <img
            :src="qrInvoice"
            height="140px"
            width="140px"
            style="margin:0; padding:0;"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script src="http://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
<script>
/* eslint-disable max-len */
import Preloader from '@/components/util/Preloader'
import { mapGetters, mapState } from 'vuex'
var moment = require('moment')
import DateTime from '@/mixins/DateTime'
import * as CONST from '@/constants'
import DateTimeHelper from '@/plugins/helpers/DateTime'

export default {
  name: 'PrintTemplate',
  components: {
    Preloader,
  },
  mixins: [DateTime],
  data() {
    return {
      currentBrand: this.$store.state.location.brand,
      referral: false,
      qrInvoice: '',
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
  props: ['template', 'order_to_print', 'preview'],
  watch: {
    all_data_fully_loaded: function(new_value) {
      // eslint-disable-next-line
      if (new_value == true) {
        this.$nextTick(() => {
          this.generateQRCode().then(() => {
            this.$emit('print_ready')
          })
        })
      }
    },
  },
  computed: {
    ...mapState('checkout', ['print', 'storeOrderNo']),
    ...mapGetters('location', ['_t', 'isTokenManager', 'getReferral']),
    ...mapGetters('customer', ['getDeliveryArea']),
    ...mapState('location', ['userShortDetails']),
    ...mapState('location', ['timezoneString']),
    ...mapState('dinein', ['selectedTableRservationData']),
    ...mapState('order', ['orderType', 'orderId']),

    showBarcode() {
      return this.template.show_item_barcode
    },
    showNumbering() {
      return this.template.show_item_nos
    },
    colspanFull() {
      return this.showNumbering ? 4 : 3
    },

    colspanFirst() {
      return this.showNumbering ? 3 : 2
    },

    dataBeingLoaded() {
      if (!this.order_to_print || !this.template) {
        return true
      }
      return false
    },
    getPrintDataTime() {
      let order = this.order
      let orderNo = order.order_no
        ? order.order_no
        : order.orderNumber
        ? order.orderNumber
        : false
      let dateTime = order.real_created_datetime
        .toString()
        .replace(/[\s-:]/g, '')
      if (orderNo) {
        return orderNo
      } else {
        return dateTime
      }
    },
    storeOrderNoInfo() {
      if (this.storeOrderNo) {
        if (this.active_store.store_prefix) {
          return this.active_store.store_prefix + this.storeOrderNo
        }
        return this.storeOrderNo
      }
      return false
    },
    crm_module_enabled: function() {
      let cb =
        typeof this.currentBrand == 'undefined'
          ? this.$store.state.location.brand
          : this.currentBrand
      for (var module of cb.enabled_modules) {
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
        return `${this.currentBrand.name} <br/> ${this.active_store.city} ${this.template['branch_label']} <br/> ${this.template['telno_label']} ${this.active_store.phone}`
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
        if (this.order.future_order_datetime) {
          return this.convertDatetime(
            this.order.future_order_datetime,
            this.timezoneString,
            'h:mm:ss A'
          )
        }
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
        if (this.order.future_order_datetime) {
          return this.convertDatetime(
            this.order.future_order_datetime,
            this.timezoneString,
            'Do MMMM YYYY'
          )
        }
        return this.convertDatetime(
          this.order.real_created_datetime,
          this.timezoneString,
          'Do MMMM YYYY'
        )
      }
      return this.current_time.format('Do MMMM YYYY')
    },
    placed_by: function() {
      if (this.order.guest_checkout) {
        return this._t('Guest')
      }
      return this.userShortDetails.username
        ? this.userShortDetails.username
        : this.$store.state.auth.userDetails.item.name
    },
    tokenNumber() {
      if (
        this.isTokenManager &&
        (this.orderType.OTApi === 'walk_in' ||
          this.orderType.OTApi === 'carhop')
      ) {
        if (
          this.$store.state.sync.online &&
          typeof this.order.tokenNumber != 'undefined'
        ) {
          return this.order.tokenNumber
        } else if (typeof this.order.token_number != 'undefined') {
          return this.order.token_number
        }
      }

      return false
    },
    //If the customer is set in the order,
    //we check if there is a property with customer info. If there is -
    // we output it. If there are no,
    //we use sample customer. If customer is not set on the order -
    // that means there should be no customer in that order
    customer() {
      if (this.order) {
        if (this.order.guest_checkout) {
          return {
            ...this.order.guest_customer,
            phone: this.order.guest_customer.phone_number,
          }
        }
        if (this.$store.state.customer.offlineData) {
          return {
            name: this.$store.state.customer.offlineData.name,
            phone: this.$store.state.customer.offlineData.phone_number,
          }
        }
        if (this.order.customer) {
          if (this.$store.state.customer.customer) {
            return {
              name: this.$store.state.customer.customer.name,
              phone: this.$store.state.customer.customer.phone_number,
            }
          } else {
            return {
              name: this.$store.state.order.selectedOrder.customer.name,
              phone: this.$store.state.order.selectedOrder.customer
                .phone_number,
            }
          }
        }
        // if (this.$store.state.customer) {
        //   return {
        //     name: this.$store.state.customer.name,
        //     phone: this.$store.state.customer.phone_number,
        //   }
        // }
      }
      return null
    },
    order_type() {
      return this.template[this.order.order_type + '_label']
    },
    all_data_fully_loaded() {
      //these are needed at main app to trigger
      //loads for collections in question
      if (this.order_to_print && this.template && this.print) {
        return true
      }
      return false
    },
    //This is a method to generate fake order for invoice generation.
    // No need to have bottom part of it at the POS
    order() {
      if (this.dataBeingLoaded) {
        return null
      }
      if (!this.print) {
        return this.order_to_print
      }
      let order = { ...this.order_to_print }
      order.items = this.loadFromCollection(
        order.items,
        'entity_id',
        '_id',
        'category/rawItems',
        ['translations_dict']
      )
      order.item_modifiers = order.item_modifiers.map(modifier => {
        this.$store.getters['modifier/rawModifiers'](modifier).forEach(
          catalogModifier => {
            if (catalogModifier._id === modifier.entity_id) {
              modifier['translations_dict'] =
                catalogModifier['translations_dict']
            }
          }
        )
        return modifier
      })

      order.order_surcharges = this.loadFromCollection(
        order.order_surcharges,
        'entity_id',
        '_id',
        'surcharge/surcharges',
        ['translations_dict']
      )

      order.order_discounts = this.loadFromCollection(
        order.order_discounts,
        'entity_id',
        '_id',
        'discount/orderDiscounts',
        ['translations_dict']
      )

      order.item_discounts = this.loadFromCollection(
        order.item_discounts,
        'entity_id',
        '_id',
        'discount/itemDiscounts',
        ['translations_dict']
      )

      order.order_payments = this.loadFromCollection(
        order.order_payments,
        'entity_id',
        '_id',
        'payment/methods',
        ['translations_dict']
      )

      return order
    },
    currentStore() {
      return this.$store.state.location.store
    },
    current_locale() {
      return this.$store.state.location.locale
    },
    company_logo() {
      return this.$store.state.location.brand &&
        this.$store.state.location.brand.company_logo
        ? this.$store.state.location.brand.company_logo
        : ''
    },
    isOrderPaidOrNot() {
      let is_call_center =
        this.order.order_type === CONST.ORDER_TYPE_CALL_CENTER
      let is_cod_order = false
      if (is_call_center)
        is_cod_order = this.referral.referral_type === CONST.REFERRAL_TYPE_COD

      let is_payment_done = this.order.order_payments.length
      // if (is_call_center && is_cod_order && is_payment_done) return true
      if (is_payment_done || is_call_center) return true
      // if (is_call_center && !is_cod_order) return true
      return false
    },
  },
  methods: {
    getTLVForValue(tagNum, tagValue) {
      var tagBuf = Buffer.from([tagNum], 'utf8')
      var tagValueLenBuf = Buffer.from([tagValue.length], 'utf8')
      var tagValueBuf = Buffer.from(tagValue, 'utf8')
      var bufsArray = [tagBuf, tagValueLenBuf, tagValueBuf]
      return Buffer.concat(bufsArray)
    },
    OrderCreatedAtUtc() {
      let dateTime = new DateTimeHelper()
      let slice_local = this.current_locale.slice(0, 2)
      var result = ''
      moment.locale(slice_local)
      if (!this.order.real_created_datetime.$date) {
        result = this.order.real_created_datetime
      } else {
        var result = dateTime
          .convert_datetime_to_local_moment(
            this.order.real_created_datetime,
            slice_local
          )
          .format()
      }
      var value = ''
      if (!this.order.real_created_datetime.$date) {
        value = this.order.real_created_datetime
      } else {
        value = parseInt(this.order.real_created_datetime.$date.$numberLong)
      }
      if (value) {
        if (!moment.utc(value).isValid()) return result
        var fmt_in = moment(value)._f
        result = moment
          .utc(value, fmt_in)
          .local()
          .utc()
          .format()
      }
      return result
    },
    // tagNum, tagValue
    getQRCode() {
      //second parameter should string always
      var sellerNameBuf = this.getTLVForValue(
        '1',
        this.currentStore.company_name
      )
      var vatRegistrationNameBuf = this.getTLVForValue(
        '2',
        this.currentStore.vat_tax_number
      )
      var timestampBuf = this.getTLVForValue('3', this.OrderCreatedAtUtc())
      var taxTotalNameBuf = this.getTLVForValue(
        '4',
        this.format_number(this.order.balance_due)
      )
      var vatTotalBuf = this.getTLVForValue(
        '5',
        this.format_number(this.order.total_tax)
      )
      var tagsBufsArray = [
        sellerNameBuf,
        vatRegistrationNameBuf,
        timestampBuf,
        taxTotalNameBuf,
        vatTotalBuf,
      ]
      var qrCodeBuf = Buffer.concat(tagsBufsArray)
      var qrCodeB64 = qrCodeBuf.toString('base64')
      return qrCodeB64
    },
    generateQRCode() {
      return new Promise(resolve => {
        if (!this.order || !this.currentBrand.is_store_order_number) {
          resolve()
        } else {
          try {
            var qrcode = new QRCode('qrcode')
            qrcode.clear()
            // let base_url = process.env.VUE_APP_WEB_HOST
            let website = this.getQRCode()
            // base_url +
            // '/order-invoice/' +
            // this.currentBrand._id +
            // '/' +
            // this.currentStore._id +
            // '/' +
            // this.orderId
            qrcode.makeCode(website)

            this.qrInvoice = qrcode._oDrawing._elCanvas.toDataURL('image/png')
          } catch (e) {
            console.log(e)
          }
          resolve()
        }
      })
    },
    item_gross_price(item) {
      if (item.type === CONST.SCALE_ITEM_TYPE) {
        let cost = parseFloat(item.unit_price) + parseFloat(item.unit_tax)
        return cost + ' / ' + item.measurement_weight
      } else {
        return parseFloat(item.price) + parseFloat(item.tax)
      }
    },
    qtyString(item) {
      if (item.type === CONST.SCALE_ITEM_TYPE) {
        return item.measurement_weight
      } else {
        return item.qty
      }
    },
    loadFromCollection(orderEntities, key, map, getter, keysToLoad) {
      if (!Array.isArray(orderEntities) || !key || !map) {
        return orderEntities
      }

      const data = this.$store.getters[getter]
      if (!data) {
        return orderEntities
      }

      return orderEntities.map(entity => {
        if (data instanceof Array) {
          data.forEach(item => {
            if (entity[key] === item[map]) {
              keysToLoad.forEach(index => {
                if (item[index]) {
                  entity[index] = item[index]
                }
              })
            }
          })
        } else {
          Object.entries(data).forEach(item => {
            if (Array.isArray(item)) {
              item[1].forEach(singleItem => {
                if (entity[key] === singleItem[map]) {
                  keysToLoad.forEach(index => {
                    if (singleItem[index]) {
                      entity[index] = singleItem[index]
                    }
                  })
                }
              })
            }
          })
        }
        return entity
      })
    },
    referral_data(referralId) {
      this.referral = this.$store.getters['location/getReferral'](referralId)
    },
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
    measurement_unit(item) {
      if (item.measurement_unit) {
        return item.measurement_unit
      }
      return ''
    },
    discount_total(discount) {
      if (discount.type === 'fixed_price') {
        return parseFloat(discount.price) + parseFloat(discount.tax)
      } else {
        return parseFloat(discount.price)
      }
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
          total -= parseFloat(item_discount.tax)
        }
      }
      return total < 0 ? '0.00' : total
    },
    //These methods would need to be updated
    //at POS to search for objects in POS store
    //These functions
    translate_item(orderItem) {
      return this.translate_entity(orderItem, 'name')
    },
    // eslint-disable-next-line no-unused-vars
    translate_item_modifier(item, orderItem) {
      return this.translate_entity(item, 'name')
    },
    translate_item_discount(item) {
      return this.translate_entity(item, 'name')
    },
    translate_surcharge(item) {
      return this.translate_entity(item, 'name')
    },
    translate_order_discount(item) {
      return this.translate_entity(item, 'name')
    },
    translate_payment_type(item) {
      return this.translate_entity(item, 'name')
    },
    /*get_delivery_area_name(delivery_area_id) {
      var found = this.$store.state.customer.fetchDeliveryAreas.find(
        item => item._id == delivery_area_id
      )
      if (found) {
        return found.text
      }
    },*/
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

    combo_item_total(item_no) {
      var total = 0
      for (var item of this.order.items) {
        if (item.no == item_no) {
          total += (parseFloat(item.price) + parseFloat(item.tax)) * item.qty
        }
        if (item.for_combo === item_no) {
          for (var modifier of this.order.item_modifiers) {
            if (modifier.for_item == item.no) {
              total +=
                (parseFloat(modifier.price) + parseFloat(modifier.tax)) *
                modifier.qty
            }
          }
        }
      }

      for (var item_discount of this.order.item_discounts) {
        if (item_discount.for_item == item_no) {
          total -= parseFloat(item_discount.price)
        }
      }
      return total
    },
  },
}
</script>
