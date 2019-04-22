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
          <h4 class="customer-title">Gift Card Detail</h4>
        </div>
        <div class="modal-body gift-card-details-wrap">
          <div class="gift-card-detail">
            <p>Customer Name</p>
            <h4>{{ giftcard.customerName }}</h4>
          </div>
          <div class="gift-card-detail">
            <p>Customer Mobile</p>
            <h4>{{ giftcard.customerPhone }}</h4>
          </div>
          <div class="gift-card-detail">
            <p>Gift Card Total Balance</p>
            <h4>{{ formatPrice(giftcard.remaining_balance) }}</h4>
          </div>
          <div class="gift-card-detail">
            <p>Gift Card Remaining Balance</p>
            <h4>{{ formatPrice(giftcard.remaining_balance - giftAmount) }}</h4>
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
