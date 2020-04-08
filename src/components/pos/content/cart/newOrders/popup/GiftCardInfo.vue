<template>
  <div
    class="modal fade"
    id="gift-card-info"
    role="dialog"
    style="padding-left: 6px;"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Gift Card Details') }}
          </h4>
        </div>
        <div class="modal-body gift-card-details-wrap">
          <div class="gift-card-detail">
            <p class="color-text-invert">{{ _t('Customer Name') }}</p>
            <h4 class="color-text">{{ giftcard.customerName }}</h4>
          </div>
          <div class="gift-card-detail">
            <p class="color-text-invert">{{ _t('Customer Mobile') }}</p>
            <h4 class="color-text">{{ giftcard.customerPhone }}</h4>
          </div>
          <div class="gift-card-detail">
            <p class="color-text-invert">{{ _t('Gift Card Total Balance') }}</p>
            <h4 class="color-text">
              {{ formatPrice(giftcard.remaining_amount) }}
            </h4>
          </div>
          <div class="gift-card-detail">
            <p class="color-text-invert">
              {{ _t('Gift Card Remaining Balance') }}
            </p>
            <h4 class="color-text">
              {{ formatPrice(giftcard.remaining_amount - giftAmount) }}
            </h4>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce color-text-invert"
              data-dismiss="modal"
              @click="closeModal('#gift-card-info')"
            >
              <span>{{ _t('Close') }}</span>
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
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'GiftCardInfo',
  computed: {
    ...mapState('giftcard', ['giftcard']),
    ...mapState('checkoutForm', ['giftAmount']),
    ...mapGetters('location', ['formatPrice', '_t']),
  },
  methods: {
    closeModal(modalName) {
      hideModal(modalName)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
#gift-card-info {
  .gift-card-details-wrap {
    padding: 1.875rem 1.875rem 0rem 1.875rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    @include responsive(mobile) {
      grid-template-columns: 1fr;
    }
    .gift-card-detail {
      width: 100%;
      &:nth-child(2n) {
        margin-left: 0rem;
      }
    }
  }
}
</style>
