<template>
  <div
    class="modal fade"
    id="loyalty-payment"
    role="dialog"
    style="display: none; padding-left: 6px;"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Apply Loyalty</h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p>Enter Loyalty</p>
            <input type="text" class="add-email-from" v-model="amount" />
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>-</span> Cancel
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save"
              type="button"
              id="gift-card-btn"
              data-toggle="modal"
              data-target="#Gift-card-payemnt-details"
              data-dismiss="modal"
              @click="payByLoyalty"
            >
              Add
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Loyalty',
  data: function() {
    return {
      amount: '',
    }
  },
  methods: {
    payByLoyalty() {
      console.log('loyalty applied ' + this.amount)
      // this.$store.dispatch('checkoutForm/addGiftCardAmount', this.code)
    },
  },
}
</script>
