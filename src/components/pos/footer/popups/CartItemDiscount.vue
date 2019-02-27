<template>
  <div
    class="modal fade"
    id="select-discount-item"
    role="dialog"
    style="padding-left: 7px;"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Discount Item</h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div class="dining-option-block select-discount-option">
            <div
              class="option-contain"
              :class="{
                active: activeDiscountId == discount.item_discount_id,
              }"
              v-for="discount in itemDiscounts"
              :key="discount.item_discount_id"
              @click.prevent="selectDiscount(discount)"
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
              id="discount-save"
              @click="applyItemDiscount()"
            >
              Save
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'CartItemDiscount',
  props: {},
  computed: {
    ...mapGetters('discount', ['itemDiscounts', 'activeDiscountId']),
    ...mapGetters('location', ['formatPrice']),
  },
  methods: {
    ...mapActions('discount', ['selectDiscount', 'applyItemDiscount']),
  },
}
</script>
<style lang="sass" scoped>
.discount-item.each
  display:inline-block
</style>
