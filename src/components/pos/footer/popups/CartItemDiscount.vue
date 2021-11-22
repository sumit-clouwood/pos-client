<template>
  <div
    class="modal fade"
    id="select-discount-item"
    role="dialog"
    style="padding-left: 7px;"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">{{ _t('Item Discount') }}</h4>
        </div>
        <div
          class="item-discount-bottom-arrow food-arrow"
          v-show="showScrollDown"
          @click="scroll('up')"
        >
          <i class="fa fa-chevron-down" aria-hidden="true"></i>
        </div>
        <div class="modal-body row">
          <div class="item-discount-wrapper">
            <div
              v-show="!appliedOrderDiscount && !itemError"
              class="select-discount-option item-discounts"
              ref="itemDiscountContainer"
            >
              <div
                class="option-contain"
                :class="{
                  active: activeItemDiscountId == discount._id,
                }"
                v-for="discount in itemDiscounts"
                :key="discount._id"
                @click.prevent="selectItemDiscount(discount)"
                ref="entityItemDiscount"
              >
                <p>
                  <span v-if="discount.type === 'percentage'">
                    {{ discount.rate }} %
                  </span>
                  <span v-else-if="discount.type === 'fixed_price'">
                    {{ _t('Fixed Price') }} {{ formatPrice(discount.value) }}
                  </span>
                  <span v-else> {{ formatPrice(discount.value) }} </span>
                </p>
                <span class="mores">{{ dt(discount) }}</span>
              </div>
            </div>
          </div>
          <div class="error mx-auto" v-show="appliedOrderDiscount">
            <p class="text-danger text-center">
              {{
                _t('Please remove order discount first to apply item discount.')
              }}
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
          <div
            class="item-discount-top-arrow food-arrow"
            @click="scroll('down')"
            v-show="showScrollUp"
          >
            <i class="fa fa-chevron-up" aria-hidden="true"></i>
          </div>

          <div class="btn-announce">
            <button
              v-show="
                itemDiscounts.length && !appliedOrderDiscount && !itemError
              "
              class="btn btn-success btn-large"
              type="button"
              id="discount-save"
              @click="applyItemDiscount()"
            >
              {{ _t('Apply') }}
            </button>
            <button
              v-show="
                appliedOrderDiscount || itemError || !itemDiscounts.length
              "
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
import { bus } from '@/eventBus'
import Scroll from '@/mixins/Scroll'
export default {
  name: 'CartItemDiscount',
  data() {
    return {
      errors: 'No discount available on this item.',
      container: 'itemDiscountContainer',
      entity: 'entityItemDiscount',
      margin: 100,
      keepEntitiesInScroll: 0,
      scrollcalc: false,
    }
  },
  mixins: [Scroll],
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
  mounted() {
    bus.$on('open-item-discount-popup', () => {
      this.$nextTick(() => {
        setTimeout(() => {
          this.calculateScrolls().catch(() => {})
        }, 300)
      })
    })
  },
}
</script>
<style lang="sass" scoped>
.item-discount-wrapper
  max-height: 20rem;
  overflow: hidden;
  width: 100%;
  scroll-behavior: smooth;

  .item-discounts
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1.25rem;

    .option-contain
      cursor: pointer;
      text-align: left;
      padding: 0.6rem;

.food-arrow
  right: 10px;

.item-discount-bottom-arrow
  top: 50px;

.item-discount-top-arrow
  &.food-arrow
    right: 10px;
    bottom: 84px;
</style>
