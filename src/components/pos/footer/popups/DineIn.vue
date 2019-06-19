<template>
  <!-- Dining option Model -->
  <div class="modal fade" id="dining-option" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">{{ _t('Dinning Option') }}</h4>
        </div>
        <div class="modal-body dining-options-block">
          <div class="dining-option-block">
            <div
              class="option-contain"
              :class="{ active: selectedOrderType.OTApi === 'dine_in' }"
              @click="setOrderType({ OTview: 'Dine In', OTApi: 'dine_in' })"
            >
              <img src="img/pos/dine-in.svg" /><span>{{ _t('Dine In') }}</span>
            </div>
            <div
              class="option-contain"
              :class="{ active: selectedOrderType.OTApi === 'takeaway' }"
              @click="
                setOrderType({
                  OTview: 'Take Away',
                  OTApi: 'takeaway',
                })
              "
            >
              <img src="img/pos/take-away.svg" /><span>
                {{ _t('Take Away') }}
              </span>
            </div>
            <div
              class="option-contain"
              :class="{ active: selectedOrderType.OTApi === 'call_center' }"
              @click="
                setOrderType({ OTview: 'Delivery', OTApi: 'call_center' })
              "
            >
              <img src="img/pos/delivery-icon.svg" /><span>
                {{ _t('Delivery') }}
              </span>
            </div>
            <div
              class="option-contain"
              :class="{ active: selectedOrderType.OTApi === 'event' }"
              @click="setOrderType({ OTview: 'Event', OTApi: 'event' })"
            >
              <img src="img/pos/event.svg" /><span>{{ _t('Event') }}</span>
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
              {{ _t('Ok') }}
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
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'DineIn',
  props: {},
  data: function() {
    return {
      selectedOrderType: this.$store.state.order.orderType,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['orderType']),
  },
  watch: {
    orderType(newVal) {
      this.selectedOrderType = newVal
    },
  },

  methods: {
    setOrderType(orderType) {
      if (this.selectedOrderType === orderType.OTApi) {
        //toggle
        this.selectedOrderType = { OTview: 'Walk In', OTApi: 'walk_in' }
      } else {
        this.selectedOrderType = orderType
      }
    },
    updateOrderType() {
      this.$store.dispatch('order/updateOrderType', this.selectedOrderType)
    },
  },
}
</script>
