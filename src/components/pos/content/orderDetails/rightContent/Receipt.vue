<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div
    v-if="orderDetails"
    class="tab-pane fade show active color-dashboard-background"
    id="nav-home"
    role="tabpanel"
    aria-labelledby="nav-home-tab"
  >
    <div class="order-receipt color-dashboard-background">
      <div class="order-note" v-if="orderDetails.order_note">
        {{ orderDetails.order_note }}
      </div>
      <div class="items-container">
        <table
          class="table col-md-12 color-tables-background table-responsive receipt-table"
        >
          <thead>
            <tr>
              <th
                class="receipt-heading color-text-invert color-secondary"
                style="width: 250px;"
              >
                {{ _t('Item') }}
              </th>
              <th
                class="receipt-heading color-text-invert color-secondary"
                style="width: 150px;"
              >
                {{ _t('Base Price') }}
              </th>
              <th
                class="receipt-heading color-text-invert color-secondary"
                style="width: 60px;"
              >
                {{ _t('Qty') }}
              </th>
              <th
                class="receipt-heading color-text-invert color-secondary"
                style="width: 150px;"
              >
                {{ _t('Total Price') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, key) in orderDetails.items">
              <tr v-if="item.type == 'combo_item'" :key="key">
                <td
                  style="width: 250px;"
                  class="color-tables-background color-text"
                >
                  <div>{{ item.name }}</div>

                  <template
                    v-for="(combo_item, cmbKey) in orderDetails.items"
                    v-if="combo_item.for_combo === item.no"
                  >
                    <div :key="cmbKey">
                      <div class="combo-items">
                        {{ combo_item.qty }}
                        <span> {{ combo_item.name }}</span>
                      </div>
                      <div
                        class="discount"
                        v-if="orderDetails.item_discounts.length"
                      >
                        {{
                          getItemSubsets({
                            subset: orderDetails.item_discounts,
                            itemId: item.no,
                            selector: 'item_discounts',
                          })
                        }}
                        <div
                          v-for="(discount, index) in filterComboItemDiscounts(
                            orderDetails.item_discounts,
                            combo_item.for_item
                          )"
                          :key="index"
                        >
                          <span v-if="item.no === discount.for_item">
                            {{ discount.name }} -
                            {{ formatPrice(discount.price) }}
                          </span>
                        </div>
                      </div>
                      <div
                        class="modifier"
                        v-if="orderDetails.item_modifiers.length"
                      >
                        {{
                          getItemSubsets({
                            subset: orderDetails.item_modifiers,
                            itemId: item.no,
                            selector: 'item_modifiers',
                          })
                        }}
                        <div
                          v-for="(modifier, key) in orderDetails.item_modifiers"
                          :key="key"
                        >
                          <span v-if="modifier.for_item == item.no">
                            <span v-if="modifier.qty > 0"
                              >+{{ modifier.qty }}</span
                            >
                            {{ modifier.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </td>
                <td
                  style="width: 150px;"
                  class="base-price color-tables-background color-text"
                >
                  {{ formatPrice(item.price) }}
                </td>
                <td class="qty color-tables-background color-text">
                  {{ item.qty }}
                </td>
                <td class="price color-tables-background color-text">
                  {{ getTotalPrice(item) }}
                </td>
              </tr>
              <tr
                :key="'item' + key"
                v-if="
                  item.type != 'combo_item' &&
                    (item.for_combo === false || item.for_combo == null)
                "
              >
                <td
                  style="width: 250px;"
                  class="color-tables-background color-text"
                >
                  <div>{{ item.name }}</div>
                  <div
                    class="discount"
                    v-if="orderDetails.item_discounts.length"
                  >
                    {{
                      getItemSubsets({
                        subset: orderDetails.item_discounts,
                        itemId: item.no,
                        selector: 'item_discounts',
                      })
                    }}
                    <div
                      v-for="(discount, index) in orderDetails.item_discounts"
                      :key="index"
                    >
                      <span v-if="item.no === discount.for_item">
                        {{ discount.name }} - {{ formatPrice(discount.price) }}
                      </span>
                    </div>
                  </div>
                  <div
                    class="modifier"
                    v-if="orderDetails.item_modifiers.length"
                  >
                    {{
                      getItemSubsets({
                        subset: orderDetails.item_modifiers,
                        itemId: item.no,
                        selector: 'item_modifiers',
                      })
                    }}
                    <div
                      v-for="(modifier, key) in orderDetails.item_modifiers"
                      :key="key"
                    >
                      <span v-if="modifier.for_item == item.no">
                        <span v-if="modifier.qty > 0">+{{ modifier.qty }}</span>
                        {{ modifier.name }}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  style="width: 150px;"
                  class="base-price color-tables-background color-text"
                >
                  {{ formatPrice(item.price) }}
                </td>
                <td
                  style="width: 60px;"
                  class="qty color-tables-background color-text"
                >
                  {{ item.qty }}
                </td>
                <td
                  style="width: 150px;"
                  class="price color-tables-background color-text"
                >
                  {{ getTotalPrice(item) }}
                </td>
              </tr>
              <tr v-if="item.note" :key="'note' + key">
                <td colspan="4" class="note-td">
                  <div>
                    <span class="item-note">{{ _t('Note') }}: </span>
                    <i>{{ item.note }}</i>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="receipt-summary">
        <div class="caption subtotal color-text-invert">Sub Total:</div>
        <div class="subtotal color-text">{{ orderDetails.sub_total }}</div>
        <!---->
        <div
          class="caption color-text-invert"
          v-if="orderDetails.total_surcharge"
        >
          {{ _t('Surcharges') }}:
        </div>
        <div v-if="orderDetails.total_surcharge" class=" color-text">
          {{ orderDetails.total_surcharge }}
        </div>
        <div
          class="caption color-text-invert"
          v-if="orderDetails.total_discount"
        >
          {{ _t('Discount') }}
          <span v-if="orderDetails.order_discounts.length">
            ({{ orderDetails.order_discounts[0].name }}):</span
          >
        </div>
        <div v-if="orderDetails.total_discount" class=" color-text">
          {{ orderDetails.total_discount }}
        </div>
        <div class="caption color-text-invert">{{ _t('Total Tax') }}:</div>
        <div class=" color-text">
          {{ orderDetails.total_tax }}
        </div>
        <div class="caption color-text-invert">{{ _t('Tips') }}:</div>
        <div class=" color-text">
          {{ orderDetails.tip_amount || 0 }}
        </div>
        <div class="total color-text-invert">
          {{ _t('Total') }}
        </div>
        <div class="total color-text">
          {{ orderTotal }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable max-len */

import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Receipt',
  props: ['order_data'],
  data() {
    return {
      iteDiscount: {},
      itemModifiers: {},
    }
  },
  computed: {
    ...mapGetters('location', ['_t', 'formatPrice']),
    ...mapState('order', ['orderSource']),
    orderTotal() {
      return this.Num.round(
        parseFloat(this.orderDetails.balance_due) +
          parseFloat(this.orderDetails.tip_amount)
      ).toFixed(2)
    },
    orderDetails() {
      if (!this.order_data || typeof this.order_data.item === undefined) {
        return false
      }
      var order_item = this.order_data.item
      if (
        this.order_data.item.multi_store == true &&
        this.order_data.item.multi_store_data &&
        this.order_data.item.multi_store_data.items
      ) {
        order_item.items = this.order_data.item.multi_store_data.items
        order_item.item_modifiers = this.order_data.item.multi_store_data.item_modifiers
        order_item.item_discounts = this.order_data.item.multi_store_data.item_discounts
        order_item.order_surcharges = this.order_data.item.multi_store_data.order_surcharges
        order_item.order_discounts = this.order_data.item.multi_store_data.order_discounts
        order_item.sub_total = this.order_data.item.multi_store_data.sub_total
        order_item.total_surcharge = this.order_data.item.multi_store_data.total_surcharge
        order_item.surcharge_tax = this.order_data.item.multi_store_data.surcharge_tax
        order_item.amount_changed = this.order_data.item.multi_store_data.amount_changed
        order_item.tip_amount = this.order_data.item.multi_store_data.tip_amount
        order_item.total_tax = this.order_data.item.multi_store_data.total_tax
        order_item.total_discount = this.order_data.item.multi_store_data.total_discount
        order_item.total_paid = this.order_data.item.multi_store_data.total_paid
        order_item.balance_due = this.order_data.item.multi_store_data.balance_due
        order_item.order_payments = this.order_data.item.multi_store_data.order_payments
        order_item.delivery_surcharge = this.order_data.item.multi_store_data.delivery_surcharge
      }
      return order_item
    },
  },
  methods: {
    filterComboItemModifiers(itemModifiers, forComboItem) {
      return itemModifiers.filter(itemModifier => itemModifier === forComboItem)
    },
    filterComboItemDiscounts(itemDiscounts, forComboItem) {
      return itemDiscounts.filter(itemDiscount => itemDiscount === forComboItem)
    },
    getTotalPrice: function(item) {
      return this.formatPrice(
        item.price * item.qty +
          this.modifiersPrice(item.no) -
          this.itemDiscountPrice(item.no)
      )
    },
    itemDiscountPrice(itemNo) {
      let discountPrice = 0

      for (let discount of this.orderDetails.item_discounts) {
        if (discount.for_item === itemNo) {
          discountPrice += discount.price
        }
      }
      return discountPrice
    },
    modifiersPrice(itemNo) {
      let modifierPrice = 0
      for (let modifier of this.orderDetails.item_modifiers) {
        if (modifier.for_item === itemNo) {
          modifierPrice += modifier.qty * modifier.price
        }
      }
      return modifierPrice
    },
    getItemSubsets: function(details) {
      if (details.selector == 'item_modifiers') {
        this.itemDiscount = details.subset.find(
          item => item.for_item == details.itemId
        )
      } else {
        this.itemModifiers = details.subset.find(
          item => item.for_item == details.itemId
        )
      }

      /*return details.subset.forEach(item => {
        if (item.for_item == details.itemId) {
          return item
        }
      })*/
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.combo-items {
  font-size: 0.7rem;
  padding-left: $px30;
}
.combo-items-modifier {
  font-size: 0.7rem;
  padding-left: $px60;
}
.items-container {
  max-height: 282px;
  overflow: auto;
}
.order-note {
  display: block;
  background: #f5f6f6;
  border-radius: 6px;
  margin-bottom: 0.3125rem;
  padding: 0.625rem;
  -ms-flex-item-align: center;
  align-self: center;
  color: #49a218;
  border-bottom: none;
}
.table .modifier,
.table .discount {
  font-size: 0.7rem;
  padding-left: 1.875rem;
}
.receipt-summary {
  border-top: 1px solid gray;
}
.receipt-heading {
  text-transform: uppercase;
  border-bottom: 1px solid gray;
  font-size: 0.8rem;
}
.receipt-summary,
.payments_summary {
  display: grid;
  grid-template-columns: 1fr auto;
  text-align: right;
  grid-column-gap: 1.25rem;
  text-transform: uppercase;
  line-height: 2.5;
}
.caption {
  font-size: 12px !important;
  font-weight: 400;
}
.receipt-summary .caption,
.payments_summary .caption {
  color: gray;
}
.item-note {
  color: #3d3f43;
  font-size: 0.875rem;
  font-weight: 600;
}
.note-td {
  padding-top: 0;
  border-top: 0;
  padding-left: 1.875rem;
}
.receipt-table {
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
