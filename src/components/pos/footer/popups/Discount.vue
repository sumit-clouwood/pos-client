<template>
  <!-- Select Discount  -->
  <div class="modal fade" id="select-discount" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Select') + ' ' + _t('Discount') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
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
          <div v-else class="dining-option-block select-discount-option">
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
              <span class="more color-text" v-if="discount.max_discount_value"
                >Min Cart {{ discount.min_cart_value }} Max Disc
                {{ discount.max_discount_value }}</span
              >
            </div>
          </div>
        </div>
        <div class="modal-footer discount-footer">
          <div class="food-top-arrow food-arrow disable" @click="discountTop">
            <i class="fa fa-chevron-up" aria-hidden="true"></i>
          </div>
          <div
            class="food-bottom-arrow food-arrow disable"
            @click="discountBottom"
          >
            <i class="fa fa-chevron-down" aria-hidden="true"></i>
          </div>

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
              v-if="
                appliedItemDiscounts.length ||
                  !items.length ||
                  !discounts.length
              "
              class="btn btn-danger btn-large color-text-invert color-button"
              type="button"
              data-dismiss="modal"
              @click="discountHendlerChange"
            >
              {{ _t('Close') }}
            </button>

            <button
              v-else
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              @click="applyOrderDiscount()"
            >
              {{ _t('Ok') }}
            </button>
            <!--<button
              v-show="orderError"
              class="btn btn-danger btn-large color-text-invert color-button"
              type="button"
              data-dismiss="modal"
              @click="discountHendlerChange"
            >
              {{ _t('Close') }}
            </button>-->
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Select Discount -->
</template>

<script>
/* global $ */
/* global hideModal */
import { mapGetters, mapState } from 'vuex'
import { bus } from '@/eventBus'
export default {
  name: 'Discount',
  props: {},
  data() {
    return {
      discountBlockHeight: 0,
      discountBlockInitHeight: 0,
      discountBlockItemHeight: 0,
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
    bus.$on('check-discount-height', () => {
      setTimeout(() => {
        if ($('#select-discount').hasClass('show')) {
          this.discountScroll()
        }
      }, 300)
    })
  },
  methods: {
    applyOrderDiscount: function() {
      this.$store
        .dispatch('discount/applyOrderDiscount')
        .then(() => {
          hideModal('#select-discount')
          this.discountHendlerChange()
        })
        .catch()
    },
    discountHendlerChange() {
      this.$store.dispatch('discountHendlerChange')
    },
    selectOrderDiscount: function(discount) {
      this.$store.dispatch('discount/selectOrderDiscount', discount)
    },
    discountScroll() {
      let discountBlockHeight = $('.select-discount').innerHeight()
      this.discountBlockHeight = discountBlockHeight
      this.discountBlockInitHeight = discountBlockHeight
      this.discountBlockItemHeight = $('.select-discount-option').innerHeight()
      $(
        '.discount-footer .food-bottom-arrow, .discount-footer .food-top-arrow'
      ).removeClass('disable')
      if (this.discountBlockHeight > this.discountBlockItemHeight) {
        $(
          '.discount-footer .food-bottom-arrow, .discount-footer .food-top-arrow'
        ).addClass('disable')
      }
      if (this.discountBlockHeight === this.discountBlockInitHeight) {
        $('.discount-footer .food-top-arrow').addClass('disable')
      }
    },
    discountBottom() {
      if (this.discountBlockHeight >= this.discountBlockItemHeight) {
        $('.discount-footer .food-bottom-arrow').addClass('disable')
        this.discountBlockHeight = parseInt(this.discountBlockItemHeight)
        return false
      } else {
        $('.discount-footer .food-top-arrow').removeClass('disable')
        if (
          this.discountBlockHeight == this.discountBlockInitHeight ||
          this.discountBlockHeight === 0
        ) {
          this.discountBlockHeight += parseInt(
            this.discountBlockInitHeight - 100
          )
        } else {
          this.discountBlockHeight += parseInt(this.discountBlockInitHeight)
        }
      }

      $('.select-discount').animate(
        { scrollTop: this.discountBlockHeight },
        1000
      )

      if (this.discountBlockHeight >= this.discountBlockItemHeight) {
        $('.discount-footer .food-bottom-arrow').addClass('disable')
        this.discountBlockHeight = parseInt(this.discountBlockItemHeight)
      }
    },
    discountTop() {
      if (this.discountBlockHeight <= 0) {
        this.discountBlockHeight = parseInt(this.discountBlockInitHeight)
        $('.discount-footer  .food-top-arrow').addClass('disable')
        return false
      } else {
        $('.discount-footer  .food-bottom-arrow').removeClass('disable')
        if (this.discountBlockHeight === this.discountBlockItemHeight) {
          this.discountBlockHeight -= parseInt(
            this.discountBlockInitHeight + 100
          )
        } else {
          this.discountBlockHeight -= parseInt(this.discountBlockInitHeight)
        }
      }
      $('.select-discount').animate(
        { scrollTop: this.discountBlockHeight },
        1000
      )

      if (this.discountBlockHeight <= 0) {
        this.discountBlockHeight = parseInt(this.discountBlockInitHeight)
        $('.discount-footer  .food-top-arrow').addClass('disable')
      }
    },
  },
}
</script>
<style lang="sass" scoped>
.error
  width: 100%
  /*padding: 40px 5px 10px 5px*/
</style>
