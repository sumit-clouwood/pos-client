<template>
  <div class="modal fade" id="item-delivery-time-selection" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('Select item delivery time') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div id="available-tables" class="available-tables cursor-pointer">
            <div class="table-status-container">
              <span
                v-for="i in timer_loop"
                :key="i"
                class="time-slots"
                :class="itemDeliveryTime === i ? 'active' : ''"
              >
                <span @click="setItemDeliveryTime(i)">
                  <span class="time-number">
                    {{ i }}
                  </span>
                  <span class="font-weight-bold">{{ _t(' Minutes') }}</span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="move-Table-only"
              @click="closeModal(itemDeliveryTime)"
            >
              {{ _t('Apply') }}
            </button>
            <button @click="closeModal(0)" type="button" class="btn btn-danger">
              {{ _t('Cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global hideModal */
import { mapGetters } from 'vuex'
export default {
  name: 'ItemDeliveryTimeSlots',
  data() {
    return {
      timerStart: 5,
      timerEnd: 60,
      itemDeliveryTime: 0,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    timer_loop() {
      let timer_ = []
      let i = this.timerStart
      for (i; i <= this.timerEnd; i += this.timerStart) {
        i < 10 ? timer_.push('0' + i) : timer_.push(i)
      }
      return timer_
    },
  },
  methods: {
    setItemDeliveryTime(time) {
      this.itemDeliveryTime = time
      this.$store.commit('orderForm/setItemDeliveryTime', time)
      this.$store.dispatch('order/addItemDeliveryTime', time)
    },
    closeModal(time) {
      this.setItemDeliveryTime(time)
      hideModal('#item-delivery-time-selection')
    },
  },
  mounted() {
    this.itemDeliveryTime = 0
  },
}
</script>
<style lang="scss" scoped>
/*#select-item-time {
  background: transparent;
  border: none;
  border-bottom: 1px solid #000;
  color: #000;
  padding: 15px 16px 13px;
  line-height: 15px;
}*/
@media only screen and (min-width: 320px) and (max-width: 576px) {
  #select-item-time {
    width: 100%;
    font-size: 20px;
  }
  .time-s {
    font-size: 20px;
  }
}
/*.dropdown-menu {
  padding: 0.5rem 1.5rem;
}*/
.time-number {
  font-size: 2.15rem !important;
  color: rgba(11, 11, 11, 0.6);
}
.time-slots {
  border: 2px solid #e0e3e6 !important;
  padding: 0.75rem 0.3125rem;
  position: relative;
  border-radius: 4px;
  //min-height: 55px;
  &.active {
    border-color: #5056ca;

    &:after {
      content: '\F00C';
      font-family: FontAwesome;
      font-size: 1.125rem;
      color: #fff;
      position: absolute;
      text-align: center;
      height: 1.5625rem;
      width: 1.5625rem;
      background-repeat: no-repeat;
      right: 0;
      top: 0;
      border-radius: 0 0 0 3px;
      background-color: #767dff;
      background-position: center center;
      border-color: #767dff !important;
    }
  }
}
#item-delivery-time-selection {
  z-index: 9999;
  .modal-content {
    .modal-body {
      padding: 0 30px;
    }
  }
  .table-status-container {
    display: grid;
    grid-gap: 1.25rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    width: 100%;
    max-height: 360px;
    overflow-y: auto;
    text-align: center;
  }
}
</style>
