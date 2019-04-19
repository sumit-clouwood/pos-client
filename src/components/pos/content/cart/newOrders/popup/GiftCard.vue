<template>
  <div
    class="modal fade"
    id="Gift-card-payemnt"
    role="dialog"
    style="display: none; padding-left: 6px;"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Gift Card</h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p>Enter Gift Card Code</p>
            <input type="text" class="add-email-from" v-model="code" />
          </div>
          <div v-show="error" class="msg">
            <p class="text-danger">{{ error }}</p>
          </div>
          <div v-show="msg" class="msg">
            <p class="text-info">{{ msg }}</p>
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
              @click="payByGiftCard"
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
/* global showModal, hideModal */
export default {
  name: 'GiftCard',
  data: function() {
    return {
      code: '',
      error: false,
      msg: '',
    }
  },
  methods: {
    payByGiftCard() {
      this.msg = 'Fetching gift card...'
      this.$store
        .dispatch('checkoutForm/addGiftCardAmount', this.code)
        .then(() => {
          this.error = false
          this.$store.commit('checkoutForm/showPayBreak', true)
          hideModal('#Gift-card-payemnt')
          showModal('#gift-card-info')
        })
        .catch(error => {
          this.error = error
          this.$store.commit('checkoutForm/showPayBreak', false)
        })
        .finally(() => {
          this.msg = null
        })
    },
  },
}
</script>
<style lang="sass" scoped>
.msg
  padding-top: 20px
</style>
