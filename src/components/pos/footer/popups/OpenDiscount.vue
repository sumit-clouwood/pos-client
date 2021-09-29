<template>
  <!-- Open Discount  -->
  <div class="modal fade" id="open-discount" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Open') + ' ' + _t('Discount') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block open-discount">
          <div
            class="error mx-auto"
            v-if="
              appliedItemDiscounts.length || !items.length || !discounts.length
            "
          >
            <p class="text-danger text-center">
              <span v-if="!discounts.length">
                {{ _t('Order discounts not available.') }}</span
              >
              <span v-else-if="!items.length">
                {{ _t(CONST.DISCOUNT_ORDER_ERROR_ITEM) }}
              </span>
              <span v-else-if="appliedItemDiscounts.length">
                {{ _t(CONST.DISCOUNT_ORDER_ERROR_ITEM_DISCOUNT) }}
              </span>
            </p>
          </div>
          <div v-else class="open-discount-option">
            <!-- <span>{{ _t('Discount Type') }}</span> -->
            <div class="options">
              <label class="container">
                {{ _t('Value') }}
                <input
                  type="radio"
                  name="discount_type"
                  value="value"
                  v-model="discount_type"
                />
                <span class="checkmark radiomark"></span>
              </label>
              <label class="container">
                {{ _t('Percentage') }}
                <input
                  type="radio"
                  checked="checked"
                  name="discount_type"
                  value="percentage"
                  v-model="discount_type"
                />
                <span class="checkmark radiomark"></span>
              </label>
            </div>
            <div>
              <label class="container">
                {{ _t('Included Surcharge') }}?
                <input type="checkbox" v-model="discount_included_surcharge" />
                <span class="checkmark checkboxmark"></span>
              </label>
            </div>
            <div>
              <input
                type="number"
                autocomplete="off"
                class="form-control input-text"
                placeholder="Enter value"
                v-model="discount_amount"
              />
            </div>
          </div>
        </div>
        <div
          class="error mx-auto mb-2"
          v-if="
            activeOrderDiscountId && activeOrderDiscountId !== 'open_discount'
          "
        >
          <p class="text-danger text-center">
            <span v-html="_t('Other order discount already applied.')"></span>
          </p>
        </div>
        <div class="modal-footer discount-footer">
          <div
            class="error mx-auto"
            v-if="
              orderError &&
                !(
                  appliedItemDiscounts.length ||
                  !items.length ||
                  !discounts.length
                )
            "
          >
            <p>&nbsp;</p>
            <p class="text-danger text-center">
              <span v-html="_t(orderError)"></span>
            </p>
          </div>
          <div class="btn-announce">
            <button
              class="btn btn-danger btn-large color-text-invert color-button"
              type="button"
              data-dismiss="modal"
              @click="discountHendlerChange"
            >
              {{ _t('Close') }}
            </button>
            <button
              v-if="activeOrderDiscountId"
              class="btn btn-danger btn-large color-text-invert color-button"
              type="button"
              data-dismiss="modal"
              @click="removeOpenDiscount"
            >
              {{ _t('Remove') }}
            </button>

            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              @click="applyOrderDiscount()"
            >
              {{ _t('Apply') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Open Discount -->
</template>

<script>
/* global hideModal */
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Discount',
  props: {},
  data() {
    return {
      discount_type: 'Value',
      discount_included_surcharge: false,
      discount_amount: 0,
    }
  },
  computed: {
    ...mapState('discount', ['orderError', 'appliedItemDiscounts']),
    ...mapState('order', ['items']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('discount', {
      // map `this.discounts` to `this.$store.discount.getters.orderDiscounts`
      discounts: 'orderDiscounts',
      activeOrderDiscountId: 'activeOrderDiscountId',
    }),
  },
  mounted() {
    //
  },
  methods: {
    removeOpenDiscount() {
      this.$store.commit('discount/REMOVE_ORDER_DISCOUNT')
      this.discount_type = 'value'
      this.discount_included_surcharge = false
      this.discount_amount = 0
      this.applyOrderDiscount(false)
    },
    applyOrderDiscount: function(isModalHide = true) {
      let discount = {
        _id: 'open_discount',
        name: 'Open Discount',
        include_surcharge: this.discount_included_surcharge,
        type: this.discount_type,
        value:
          this.discount_type === 'percentage'
            ? null
            : parseFloat(this.discount_amount),
        rate:
          this.discount_type === 'value'
            ? null
            : parseFloat(this.discount_amount),
        max_discount_value: 0,
        min_cart_value: 0,
      }
      this.$store.dispatch('discount/selectOrderDiscount', discount)
      this.$store
        .dispatch('discount/applyOrderDiscount')
        .then(() => {
          if (isModalHide) {
            hideModal('#open-discount')
          }
          this.discountHendlerChange()
        })
        .catch()
    },
    discountHendlerChange() {
      this.$store.dispatch('discountHendlerChange')
    },
  },
}
</script>
<style lang="scss" scoped>
.error {
  width: 100%;
  /*padding: 40px 5px 10px 5px*/
}
.open-discount-option {
  text-align: left;
  padding: 0.625rem 0.9375rem;
  margin-bottom: 0;
  overflow: hidden;
  width: 100%;
  display: grid;
  grid-gap: 1.25rem;
  .options {
    border: 1px solid #c3c1c1;
    padding: 0.625rem 0.9375rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
.input-text {
  height: 45px;
}
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-top: 5px;
  cursor: pointer;
  font-size: 14px;
  padding-top: 4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  /* Hide the browsers default radio button */
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    &:checked {
      ~ .checkmark {
        background-color: #2196f3;
        &:after {
          display: block;
        }
      }
    }
  }
  /* On mouse-over, add a grey background color */
  &:hover {
    input {
      ~ .checkmark {
        background-color: #ccc;
      }
    }
  }
  .checkboxmark {
    &:after {
      left: 9px;
      top: 5px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
  .radiomark {
    &:after {
      top: 33%;
      left: 33%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
    }
  }
}
/* Create a custom radio button */
.radiomark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 50%;
  /* Create the indicator (the dot/circle - hidden when not checked) */
  &:after {
    content: '';
    position: absolute;
    display: none;
  }
}
.checkboxmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  &:after {
    content: '';
    position: absolute;
    display: none;
  }
}
</style>
