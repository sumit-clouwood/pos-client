<template>
  <!-- Select Discount  -->
  <div class="modal fade" id="select-discount" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">
            {{ _t('Select') + ' ' + _t('Discount') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div v-if="orderError" class="error">
            <p class="text-danger text-center">{{ _t(orderError) }}</p>
          </div>
          <div
            class="dining-option-block select-discount-option"
            v-if="!orderError && discounts.length"
          >
            <div
              class="option-contain"
              :class="{
                active: activeOrderDiscountId === discount._id,
              }"
              v-for="discount in discounts"
              :key="discount._id"
              @click.prevent="selectOrderDiscount(discount)"
            >
              <p>
                {{
                  discount.type == 'percentage'
                    ? discount.rate + '%'
                    : formatPrice(discount.value)
                }}
              </p>
              <span class="more">{{ dt(discount) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              v-show="!orderError"
              class="btn btn-success btn-large"
              type="button"
              id="discount-save-btn"
              @click="applyOrderDiscount()"
            >
              {{ _t('Ok') }}
            </button>
            <button
              v-show="orderError"
              class="btn btn-danger btn-large"
              type="button"
              data-dismiss="modal"
              @click="discountHendlerGhange"
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
  computed: {
    ...mapState('discount', ['orderError', 'errorCode']),
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
      this.$store.dispatch('discountHendlerGhange')
    },
    discountHendlerGhange(){
      this.$store.dispatch('discountHendlerGhange')
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
  padding: 40px 5px 10px 5px
</style>
