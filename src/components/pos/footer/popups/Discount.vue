<template>
  <!-- Select Discount  -->
  <div class="modal fade" id="select-discount" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Select Discount</h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div v-if="error" class="error">
            <p>{{ error }}</p>
          </div>
          <div
            class="dining-option-block select-discount-option"
            v-if="!error && discounts.length"
          >
            <div
              class="option-contain"
              :class="{
                active: activeOrderDiscountId == discount.discount_id,
              }"
              v-for="discount in discounts"
              :key="discount.discount_id"
              @click.prevent="selectOrderDiscount(discount)"
            >
              <p>
                {{
                  discount.type == 'percentage'
                    ? discount.rate + '%'
                    : formatPrice(discount.rate)
                }}
              </p>
              <span class="more">{{ discount.name }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              id="discount-save-btn"
              @click="applyOrderDiscount()"
            >
              Ok
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
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Discount',
  props: {},
  computed: {
    ...mapState('discount', ['error']),
    ...mapGetters('location', ['formatPrice']),
    ...mapGetters('discount', {
      // map `this.discounts` to `this.$store.discount.getters.orderDiscounts`
      discounts: 'orderDiscounts',
      activeOrderDiscountId: 'activeOrderDiscountId',
    }),
  },
  methods: {
    applyOrderDiscount: function(discount) {
      this.$store.dispatch('discount/applyOrderDiscount', discount)
    },
    selectOrderDiscount: function(discount) {
      this.$store.dispatch('discount/selectOrderDiscount', discount)
    },
  },
}
</script>
