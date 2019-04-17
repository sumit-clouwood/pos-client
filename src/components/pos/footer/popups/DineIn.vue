<template>
  <!-- Dining option Model -->
  <div class="modal fade" id="dining-option" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Dinning Option</h4>
        </div>
        <div class="modal-body row dining-options-block">
          <div class="dining-option-block">
            <div
              class="option-contain"
              :class="{ active: selectedOrderType === 'dinein' }"
              @click="setOrderType('dinein')"
            >
              <img src="img/pos/dine-in.svg" /><span>Dine In</span>
            </div>
            <div
              class="option-contain"
              :class="{ active: selectedOrderType === 'takeaway' }"
              @click="setOrderType('takeaway')"
            >
              <img src="img/pos/take-away.svg" /><span>Take Away</span>
            </div>
          </div>
          <div class="dining-option-block">
            <div
              class="option-contain"
              :class="{ active: selectedOrderType === 'delivery' }"
              @click="setOrderType('delivery')"
            >
              <img src="img/pos/delivery-icon.svg" /><span>Delivery</span>
            </div>
            <div
              class="option-contain"
              :class="{ active: selectedOrderType === 'event' }"
              @click="setOrderType('event')"
            >
              <img src="img/pos/event.svg" /><span>Event</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              id="dining-opt"
              @click="updateOrderType()"
            >
              Ok
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Dining option model -->
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DineIn',
  props: {},
  data: function() {
    return {
      selectedOrderType: this.$store.state.order.orderType,
    }
  },
  computed: {
    ...mapState('order', ['orderType']),
  },
  watch: {
    orderType(newVal) {
      this.selectedOrderType = newVal
    },
  },

  methods: {
    setOrderType(opt) {
      if (this.selectedOrderType === opt) {
        //toggle
        this.selectedOrderType = 'Walk-in'
      } else {
        this.selectedOrderType = opt
      }
    },
    updateOrderType() {
      this.$store.dispatch('order/updateOrderType', this.selectedOrderType)
    },
  },
}
</script>
