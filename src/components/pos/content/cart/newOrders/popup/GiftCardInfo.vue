<template>
  <div
    class="modal fade"
    id="gift-card-info"
    role="dialog"
    style="padding-left: 6px;"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Gift Card Info</h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p>Gift Card Code {{ giftcard.gift_code }}</p>
            <p>
              Available Amount {{ formatPrice(giftcard.remaining_balance) }}
            </p>
            <p>
              Remaining Amount
              {{ formatPrice(giftcard.remaining_balance - giftAmount) }}
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>-</span> Close
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'GiftCardInfo',
  computed: {
    ...mapState('giftcard', ['giftcard']),
    ...mapState('checkoutForm', ['giftAmount']),
    ...mapGetters('location', ['formatPrice']),
  },
}
</script>
