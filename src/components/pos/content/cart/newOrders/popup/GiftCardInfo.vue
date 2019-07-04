<template>
  <div
    class="modal fade"
    id="gift-card-info"
    role="dialog"
    style="padding-left: 6px;"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">Gift Card Detail</h4>
        </div>
        <div class="modal-body gift-card-details-wrap">
          <div class="gift-card-detail">
            <p class="color-text-invert">Customer Name</p>
            <h4 class="color-text">{{ giftcard.customerName }}</h4>
          </div>
          <div class="gift-card-detail">
            <p class="color-text-invert">Customer Mobile</p>
            <h4 class="color-text">{{ giftcard.customerPhone }}</h4>
          </div>
          <div class="gift-card-detail">
            <p class="color-text-invert">Gift Card Total Balance</p>
            <h4 class="color-text">
              {{ formatPrice(giftcard.remaining_amount) }}
            </h4>
          </div>
          <div class="gift-card-detail">
            <p class="color-text-invert">Gift Card Remaining Balance</p>
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
import { mapState, mapGetters } from "vuex";
export default {
  name: "GiftCardInfo",
  computed: {
    ...mapState("giftcard", ["giftcard"]),
    ...mapState("checkoutForm", ["giftAmount"]),
    ...mapGetters("location", ["formatPrice"])
  }
};
</script>
