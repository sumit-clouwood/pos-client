<template>
  <!-- Select Discount  -->
  <div class="modal fade" id="select-discount" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Select') + ' ' + _t('Discount') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div class="error mx-auto" v-if="errors">
            <p class="text-danger text-center">
              {{ errors }}
            </p>
          </div>
          <div
            class="dining-option-block select-discount-option"
            v-if="!errors && discounts.length"
          >
            <div
              class="option-contain"
              :class="{
                active: activeOrderDiscountId === discount._id,
                'color-dashboard-background': true,
              }"
              v-for="discount in discounts"
              :key="discount._id"
              @click.prevent="selectOrderDiscount(discount)"
            >
              <p class="color-text-invert">
                {{
                  discount.type == 'percentage'
                    ? discount.rate + '%'
                    : formatPrice(discount.value)
                }}
              </p>
              <span class="more color-text">{{ dt(discount) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              v-show="!errors"
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              @click="applyOrderDiscount()"
            >
              {{ _t('Ok') }}
            </button>
            <button
              v-show="errors"
              class="btn btn-danger btn-large color-text-invert color-button"
              type="button"
              data-dismiss="modal"
            >
              {{ _t('Close') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Select Discount -->
</template>

<script>
/* global hideModal */
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Discount',
  props: {},
  data() {
    return {
      errors: false,
    }
  },
  watch: {
    items(orderItems) {
      if (!orderItems.length) {
        this.errors =
          'Please add some item(s) to cart before applying order discount.'
      } else {
        this.errors = false
      }
    },
    appliedItemDiscounts(itemDiscounts) {
      if (itemDiscounts.length) {
        this.errors =
          'Please add some item(s) to cart before applying order discount.'
      } else {
        this.errors = false
      }
    },
    orderError(error) {
      if (error) {
        this.errors = error
      } else {
        this.errors = false
      }
    },
    discounts(orderDiscounts) {
      if (!orderDiscounts.length) {
        this.errors = 'There is no discount available at this time.'
      } else {
        this.errors = false
      }
    },
  },

  computed: {
    ...mapState('discount', [
      'errorCode',
      'appliedItemDiscounts',
      'orderError',
    ]),
    ...mapState('order', ['items']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('discount', {
      // map `this.discounts` to `this.$store.discount.getters.orderDiscounts`
      discounts: 'orderDiscounts',
      activeOrderDiscountId: 'activeOrderDiscountId',
    }),
  },
  methods: {
    applyOrderDiscount: function() {
      this.$store
        .dispatch('discount/applyOrderDiscount')
        .then(() => {
          hideModal('#select-discount')
        })
        .catch()
    },
    selectOrderDiscount: function(discount) {
      this.$store.dispatch('discount/selectOrderDiscount', discount)
    },
  },
}
</script>
<style lang="sass" scoped>
.error
  width: 100%
  /*padding: 40px 5px 10px 5px*/
</style>
