<template>
  <div
    v-if="orderDetails"
    class="tab-pane fade show active"
    id="nav-home"
    role="tabpanel"
    aria-labelledby="nav-home-tab"
  >
    <div class="order-receipt">
      <div class="order-note">
        {{ orderDetails.order_note }}
      </div>
      <table class="table col-md-12">
        <tr>
          <th class="receipt-heading">{{ _t("Item") }}</th>
          <th class="receipt-heading">{{ _t("Base Price") }}</th>
          <th class="receipt-heading">{{ _t("Qty") }}</th>
          <th class="receipt-heading">{{ _t("Total Price") }}</th>
        </tr>
        <tr v-for="(item, key) in orderDetails.items" :key="key">
          <td>
            <div>{{ item.name }}</div>
            <div class="discount" v-if="orderDetails.item_discounts.length">
              {{
                getItemSubsets({
                  subset: orderDetails.item_discounts,
                  itemId: item.no,
                  selector: "item_discounts"
                })
              }}
              <div v-for="(discount, index) in iteDiscount" :key="index">
                {{ discount.name }}
              </div>
            </div>
            <div class="modifier" v-if="orderDetails.item_modifiers.length">
              {{
                getItemSubsets({
                  subset: orderDetails.item_modifiers,
                  itemId: item.no,
                  selector: "item_modifiers"
                })
              }}
              <div v-for="(modifier, key) in itemModifiers" :key="key">
                {{ modifier.name }}
              </div>
            </div>
          </td>
          <td class="base-price">{{ item.price }}</td>
          <td class="qty">{{ item.qty }}</td>
          <td class="price">{{ item.tax }}</td>
        </tr>
      </table>

      <div class="receipt-summary">
        <div class="caption subtotal">Sub Total:</div>
        <div class="subtotal">{{ orderDetails.sub_total }}</div>
        <!---->
        <div class="caption" v-if="orderDetails.total_surcharge">
          {{ _t("Surcharges") }}:
        </div>
        <div v-if="orderDetails.total_surcharge">
          {{ orderDetails.total_surcharge }}
        </div>
        <div class="caption" v-if="orderDetails.total_discount">
          {{ _t("Discount") }}:
        </div>
        <div v-if="orderDetails.total_discount">
          {{ orderDetails.total_discount }}
        </div>
        <div class="caption">{{ _t("Total Tax") }}:</div>
        <div>
          {{ orderDetails.total_tax }}
        </div>
        <div class="total">
          {{ _t("Total") }}
        </div>
        <div class="total">
          {{ orderDetails.balance_due }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Receipt",
  props: {
    orderDetails: {},
    iteDiscount: {},
    itemModifiers: {}
  },
  computed: {
    ...mapGetters("location", ["_t"])
  },
  methods: {
    getItemSubsets: function(details) {
      if (details.selector == "item_modifiers") {
        this.itemDiscount = details.subset.find(
          item => item.for_item == details.itemId
        );
      } else {
        this.itemModifiers = details.subset.find(
          item => item.for_item == details.itemId
        );
      }

      /*return details.subset.forEach(item => {
        if (item.for_item == details.itemId) {
          return item
        }
      })*/
    }
  }
};
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
  font-weight: 500;
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
