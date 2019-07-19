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
          <h4 class="customer-title">{{ _t('Item Discount') }}</h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div
            v-show="!appliedOrderDiscount && !itemError"
            class="dining-option-block select-discount-option"
          >
            <div
              class="option-contain"
              :class="{
                active: activeItemDiscountId == discount._id,
              }"
              v-for="discount in itemDiscounts"
              :key="discount._id"
              @click.prevent="selectItemDiscount(discount)"
            >
              <p>
                {{
                  discount.type === 'percentage'
                    ? discount.rate + '%'
                    : formatPrice(discount.value)
                }}
              </p>
              <span class="more">{{ dt(discount) }}</span>
            </div>
          </div>
          <div class="error mx-auto" v-show="appliedOrderDiscount">
            <p class="text-danger text-center">
              Please remove order discount first to apply item discount.
            </p>
          </div>
          <div class="error mx-auto" v-show="itemError">
            <p class="text-danger text-center">
              {{ itemError }}
            </p>
          </div>
          <div class="error mx-auto" v-if="itemDiscounts.length == 0">
            <p class="text-danger text-center">
              {{ errors }}
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              v-show="!appliedOrderDiscount && !itemError"
              class="btn btn-success btn-large"
              type="button"
              id="discount-save"
              @click="applyItemDiscount()"
            >
              {{ _t('Apply') }}
            </button>
            <button
              v-show="appliedOrderDiscount || itemError"
              class="btn btn-danger btn-large"
              type="button"
              data-dismiss="modal"
              @click="resetError()"
            >
              {{ _t('Close') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global hideModal */
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  name: 'CartItemDiscount',
  data() {
    return {
      errors: 'No discount available on this item.',
    }
  },
  computed: {
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('discount', ['itemDiscounts', 'activeItemDiscountId']),
    ...mapState('discount', ['appliedOrderDiscount', 'itemError']),
  },
  methods: {
    ...mapActions('discount', ['selectItemDiscount']),
    applyItemDiscount() {
      this.$store
        .dispatch('discount/applyItemDiscount')
        .then(() => {
          hideModal('#select-discount-item')
        })
        .catch()
    },
    resetError() {
      this.$store.commit('discount/SET_ITEM_ERROR', false)
    },
  },
}
</script>
