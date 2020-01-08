<template>
  <div
    v-if="orderDetails"
    class="tab-pane fade show active color-dashboard-background"
    id="nav-home"
    role="tabpanel"
    aria-labelledby="nav-home-tab"
  >
    <div class="order-receipt color-dashboard-background">
      <div class="order-note">
        {{ orderDetails.order_note }}
      </div>
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
          <tr v-for="(item, key) in orderDetails.items" :key="key">
            <td
              style="width: 250px;"
              class="color-tables-background color-text"
            >
              <div>{{ item.name }}</div>
              <div v-if="item.note">
                <i>{{ item.note }}</i>
              </div>
              <div class="discount" v-if="orderDetails.item_discounts.length">
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
              <div class="modifier" v-if="orderDetails.item_modifiers.length">
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
              {{ item.price }}
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
        </tbody>
      </table>

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
        <div class="total color-text-invert">
          {{ _t('Total') }}
        </div>
        <div class="total color-text">
          {{ orderDetails.balance_due }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Receipt',
  props: {
    orderDetails: Object,
  },
  data() {
    return {
      iteDiscount: {},
      itemModifiers: {},
    }
  },
  computed: {
    ...mapGetters('location', ['_t', 'formatPrice']),
    ...mapState('order', ['orderSource']),
  },
  mounted() {
    if (this.orderSource == 'backend') {
      this.$store.dispatch('order/loadCarhopOrder', this.orderDetails._id)
    }
  },
  methods: {
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
</style>
